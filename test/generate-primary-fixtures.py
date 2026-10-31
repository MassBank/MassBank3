#!/usr/bin/env python3
"""Reproduce the 600-record regression corpus from the immutable source release."""

import argparse
from collections import Counter
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile

COMMIT = "705afb7bccc3b2c42410a744eef73674716a60ef"
RELEASE = "2026.03"
COUNT = 600
REGRESSIONS = {
    "MSBNK-IPB_Halle-PB011601",
    "MSBNK-ISAS_Dortmund-IA000163",
    "MSBNK-HBM4EU-HB002705",
    "MSBNK-MSSJ-MSJ01047",
    "MSBNK-AAFC-AC000848",
}


def features(text):
    result = set()
    tags = (
        "COMMENT", "COPYRIGHT", "PUBLICATION", "PROJECT", "CH$COMPOUND_CLASS",
        "CH$LINK", "SP$SCIENTIFIC_NAME", "SP$LINEAGE", "SP$LINK", "SP$SAMPLE",
        "AC$CHROMATOGRAPHY", "AC$GENERAL", "AC$ION_MOBILITY", "PK$ANNOTATION",
    )
    for tag in tags:
        if f"\n{tag}: " in text:
            result.add(tag)
    date = re.search(r"^DATE: (.+)$", text, re.MULTILINE).group(1)
    result.add("date_modified" if ", modified " in date else
               "date_created" if "Created " in date else "date_only")
    if "\nMS$DATA_PROCESSING: INTENSITY CUTOFF " in text:
        result.add("known_processing_split")
    peak_text = text.split("\nPK$PEAK: ", 1)[1]
    zero = r"[+-]?0(?:\.0*)?(?:[eE][+-]?\d+)?"
    if re.search(rf"^  \S+\s+{zero}\s+\d+\s*$", peak_text, re.MULTILINE):
        result.add("zero_intensity")
    if re.search(r"^  \S+\s+\S+\s+0\s*$", peak_text, re.MULTILINE):
        result.add("zero_relative_intensity")
    if re.search(r"^  \d+\.\d{6,}\s", peak_text, re.MULTILINE):
        result.add("high_precision_mz")
    if text.count("\nCOMMENT: ") > 1:
        result.add("multiple_comments")
    if re.search(r"^COMMENT: .*  ", text, re.MULTILINE):
        result.add("comment_repeated_spaces")
    if re.search(r"^CH\$COMPOUND_CLASS: .*; ", text, re.MULTILINE):
        result.add("multiple_classes")
    return sorted(result)


def archive_records(repository, paths):
    process = subprocess.Popen(
        ["git", "-C", str(repository), "archive", COMMIT, "--", *paths],
        stdout=subprocess.PIPE,
    )
    try:
        with tarfile.open(fileobj=process.stdout, mode="r|") as archive:
            for entry in archive:
                if entry.isfile() and entry.name.endswith(".txt"):
                    yield entry.name, archive.extractfile(entry).read()
    finally:
        process.stdout.close()
        if process.wait():
            raise RuntimeError("git archive failed")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_repository", type=Path)
    args = parser.parse_args()
    records = []
    for path, content in archive_records(args.source_repository, ["*/MSBNK-*.txt"]):
        text = content.decode("utf-8")
        if "\nDEPRECATED: " in text:
            continue
        accession = Path(path).stem
        if not text.startswith(f"ACCESSION: {accession}\n"):
            raise ValueError(f"Unexpected accession in {path}")
        records.append({
            "accession": accession, "path": path,
            "sha256": hashlib.sha256(content).hexdigest(),
            "features": features(text),
        })
    records.sort(key=lambda record: hashlib.sha256(record["accession"].encode()).digest())
    selected = {r["accession"] for r in records if r["accession"] in REGRESSIONS}
    if selected != REGRESSIONS:
        raise ValueError(f"Missing regression records: {REGRESSIONS - selected}")
    contributors, covered = set(), set()
    zero_records = 0
    for record in records:
        contributor = record["path"].split("/")[0]
        flags = set(record["features"])
        if contributor not in contributors or flags - covered or (
            "zero_intensity" in flags and zero_records < 30
        ):
            selected.add(record["accession"])
            contributors.add(contributor)
            covered.update(flags)
            zero_records += "zero_intensity" in flags
    for record in records:
        if len(selected) >= COUNT:
            break
        selected.add(record["accession"])
    if len(selected) != COUNT:
        raise ValueError(f"Selection has {len(selected)} records, expected {COUNT}")
    chosen = sorted((r for r in records if r["accession"] in selected), key=lambda r: r["path"])
    output = Path(__file__).resolve().parents[1] / "pkg/mb3server/testdata/primary"
    output.mkdir(parents=True, exist_ok=True)
    archive_path = output / "records.tar.gz"
    with archive_path.open("wb") as target, gzip.GzipFile(
        fileobj=target, mode="wb", filename="", mtime=0
    ) as compressed, tarfile.open(fileobj=compressed, mode="w") as archive:
        for path, content in archive_records(args.source_repository, [r["path"] for r in chosen]):
            entry = tarfile.TarInfo(path)
            entry.size = len(content)
            entry.mode = 0o644
            archive.addfile(entry, io.BytesIO(content))
    manifest = {
        "source_repository": "https://github.com/MassBank/MassBank-data",
        "source_release": RELEASE, "source_commit": COMMIT, "count": COUNT,
        "selection": "SHA-256 accession order; all contributors and observed feature categories; "
                     "at least 30 zero-intensity records; five named regressions; fill to 600",
        "archive_sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
        "contributors": dict(sorted(Counter(r["path"].split("/")[0] for r in chosen).items())),
        "coverage": dict(sorted(Counter(f for r in chosen for f in r["features"]).items())),
        "records": chosen,
    }
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(json.dumps({key: value for key, value in manifest.items() if key != "records"}, indent=2))


if __name__ == "__main__":
    main()
