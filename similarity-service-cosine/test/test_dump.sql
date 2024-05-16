CREATE TABLE public.massbank (
    id integer NOT NULL,
    filename character varying,
    document jsonb,
    metadataid integer
);


INSERT INTO public.massbank (id, filename, document, metadataid) VALUES (1, 'MassBank-data-main/AAFC/MSBNK-AAFC-AC000001.txt', '{"date": {"created": "2017-07-07T00:00:00Z", "updated": "2017-07-07T00:00:00Z", "modified": "0001-01-01T00:00:00Z"}, "peak": {"peak": {"mz": [133.06480407714844, 151.0753936767578, 155.97430419921875, 161.0596923828125, 179.07029724121094], "rel": [225, 94, 112, 999, 750], "header": ["m/z", "int.", "rel.int."], "intensity": [21905.33203125, 9239.8974609375, 10980.8896484375, 96508.4375, 72563.875]}, "n_Peak": 5, "splash": "splash10-03fr-0900000000-035ec76d23650a15673b", "annotation": {"header": ["m/z", "tentative_formula", "mass_error(ppm)"], "values": {"m/z": [133.0643, 151.0751, 161.0591, 179.0702], "mass_error(ppm)": [-3.74, -1.72, -3.77, -0.39], "tentative_formula": ["C9H9O1+", "C9H11O2+", "C10H9O2+", "C10H11O3+"]}}}, "title": "Mellein; LC-ESI-ITFT; MS2; CE: 10; R=17500; [M+H]+", "authors": [{"name": "Justin B. Renaud", "marc_relator": ""}, {"name": " Mark W. Sumarah", "marc_relator": ""}, {"name": " Agriculture and Agri-Food Canada", "marc_relator": ""}], "license": "CC BY-SA", "project": null, "species": {"link": null, "name": null, "sample": null, "lineage": null}, "comments": [{"value": "isolated standard", "subtag": "CONFIDENCE"}], "compound": {"link": [{"database": "INCHIKEY", "identifier": "KWILGNNWGSNMPA-UHFFFAOYSA-N"}, {"database": "CAS", "identifier": "17397-85-2"}, {"database": "PUBCHEM", "identifier": "CID:28516"}, {"database": "CHEMSPIDER", "identifier": "26529"}, {"database": "KNAPSACK", "identifier": "C00000550"}, {"database": "COMPTOX", "identifier": "DTXSID60891794"}], "mass": 178.06299, "name": ["Mellein", "Ochracin", "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one"], "inchi": "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3", "smiles": "CC1CC2=C(C(=CC=C2)O)C(=O)O1", "classes": ["Natural Product; Fungal metabolite"], "formula": "C10H10O3", "cdk_depict": null}, "metadata": {"file_name": "MassBank-data-main/AAFC/MSBNK-AAFC-AC000001.txt", "version_ref": ""}, "accession": "MSBNK-AAFC-AC000001", "copyright": "Copyright (C) 2017", "deprecated": null, "acquisition": {"general": null, "instrument": "Q-Exactive Orbitrap Thermo Scientific", "chromatography": [{"value": "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM", "subtag": "COLUMN_NAME"}, {"value": "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min", "subtag": "FLOW_GRADIENT"}, {"value": "0.3 mL min-1", "subtag": "FLOW_RATE"}, {"value": "3.44", "subtag": "RETENTION_TIME"}, {"value": "1094", "subtag": "NAPS_RTI"}, {"value": "A H2O 0.1% FA", "subtag": "SOLVENT"}, {"value": "B ACN 0.1% FA", "subtag": "SOLVENT"}], "instrument_type": "LC-ESI-ITFT", "mass_spectrometry": [{"value": "MS2", "subtag": "MS_TYPE"}, {"value": "POSITIVE", "subtag": "ION_MODE"}, {"value": "ESI", "subtag": "IONIZATION"}, {"value": "3.9 kV", "subtag": "IONIZATION_VOLTAGE"}, {"value": "HCD", "subtag": "FRAGMENTATION_MODE"}, {"value": "10(NCE)", "subtag": "COLLISION_ENERGY"}, {"value": "17500", "subtag": "RESOLUTION"}]}, "contributor": "AAFC", "publication": "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5", "mass_spectrometry": {"focused_ion": [{"value": "161.0591", "subtag": "BASE_PEAK"}, {"value": "179.0697", "subtag": "PRECURSOR_M/Z"}, {"value": "[M+H]+", "subtag": "PRECURSOR_TYPE"}], "data_processing": [{"value": "Proteowizard", "subtag": "DEPROFILE"}, {"value": "based on Fragment ion formula determination", "subtag": "RECALIBRATE"}, {"value": "CUTOFF 0.05 Base Peak", "subtag": "INTENSITY"}]}}', 1);
INSERT INTO public.massbank (id, filename, document, metadataid) VALUES (2, 'MassBank-data-main/AAFC/MSBNK-AAFC-AC000002.txt', '{"date": {"created": "2017-07-07T00:00:00Z", "updated": "2017-07-07T00:00:00Z", "modified": "0001-01-01T00:00:00Z"}, "peak": {"peak": {"mz": [133.06480407714844, 151.0753936767578, 155.97450256347656, 161.0596923828125, 179.07029724121094], "rel": [193, 85, 35, 999, 759], "header": ["m/z", "int.", "rel.int."], "intensity": [46563.63671875, 20681.7109375, 8681.3095703125, 239234.5625, 181936.171875]}, "n_Peak": 5, "splash": "splash10-03fr-0900000000-7ddd9e0713885268b763", "annotation": {"header": ["m/z", "tentative_formula", "mass_error(ppm)"], "values": {"m/z": [133.0644, 151.0748, 161.059, 179.0699], "mass_error(ppm)": [-2.99, -3.71, -4.4, -2.07], "tentative_formula": ["C9H9O1+", "C9H11O2+", "C10H9O2+", "C10H11O3+"]}}}, "title": "Mellein; LC-ESI-ITFT; MS2; CE: 20; R=17500; [M+H]+", "authors": [{"name": "Justin B. Renaud", "marc_relator": ""}, {"name": " Mark W. Sumarah", "marc_relator": ""}, {"name": " Agriculture and Agri-Food Canada", "marc_relator": ""}], "license": "CC BY-SA", "project": null, "species": {"link": null, "name": null, "sample": null, "lineage": null}, "comments": [{"value": "isolated standard", "subtag": "CONFIDENCE"}], "compound": {"link": [{"database": "INCHIKEY", "identifier": "KWILGNNWGSNMPA-UHFFFAOYSA-N"}, {"database": "CAS", "identifier": "17397-85-2"}, {"database": "PUBCHEM", "identifier": "CID:28516"}, {"database": "CHEMSPIDER", "identifier": "26529"}, {"database": "KNAPSACK", "identifier": "C00000550"}, {"database": "COMPTOX", "identifier": "DTXSID60891794"}], "mass": 178.06299, "name": ["Mellein", "Ochracin", "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one"], "inchi": "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3", "smiles": "CC1CC2=C(C(=CC=C2)O)C(=O)O1", "classes": ["Natural Product; Fungal metabolite"], "formula": "C10H10O3", "cdk_depict": null}, "metadata": {"file_name": "MassBank-data-main/AAFC/MSBNK-AAFC-AC000002.txt", "version_ref": ""}, "accession": "MSBNK-AAFC-AC000002", "copyright": "Copyright (C) 2017", "deprecated": null, "acquisition": {"general": null, "instrument": "Q-Exactive Orbitrap Thermo Scientific", "chromatography": [{"value": "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM", "subtag": "COLUMN_NAME"}, {"value": "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min", "subtag": "FLOW_GRADIENT"}, {"value": "0.3 mL min-1", "subtag": "FLOW_RATE"}, {"value": "3.44", "subtag": "RETENTION_TIME"}, {"value": "1094", "subtag": "NAPS_RTI"}, {"value": "A H2O 0.1% FA", "subtag": "SOLVENT"}, {"value": "B ACN 0.1% FA", "subtag": "SOLVENT"}], "instrument_type": "LC-ESI-ITFT", "mass_spectrometry": [{"value": "MS2", "subtag": "MS_TYPE"}, {"value": "POSITIVE", "subtag": "ION_MODE"}, {"value": "ESI", "subtag": "IONIZATION"}, {"value": "3.9 kV", "subtag": "IONIZATION_VOLTAGE"}, {"value": "HCD", "subtag": "FRAGMENTATION_MODE"}, {"value": "20(NCE)", "subtag": "COLLISION_ENERGY"}, {"value": "17500", "subtag": "RESOLUTION"}]}, "contributor": "AAFC", "publication": "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5", "mass_spectrometry": {"focused_ion": [{"value": "161.059", "subtag": "BASE_PEAK"}, {"value": "179.0697", "subtag": "PRECURSOR_M/Z"}, {"value": "[M+H]+", "subtag": "PRECURSOR_TYPE"}], "data_processing": [{"value": "Proteowizard", "subtag": "DEPROFILE"}, {"value": "based on Fragment ion formula determination", "subtag": "RECALIBRATE"}, {"value": "CUTOFF 0.05 Base Peak", "subtag": "INTENSITY"}]}}', 1);
INSERT INTO public.massbank (id, filename, document, metadataid) VALUES (3, 'MassBank-data-main/AAFC/MSBNK-AAFC-AC000003.txt', '{"date": {"created": "2017-07-07T00:00:00Z", "updated": "2017-07-07T00:00:00Z", "modified": "0001-01-01T00:00:00Z"}, "peak": {"peak": {"mz": [105.06990051269531, 133.06480407714844, 151.0753936767578, 161.0596923828125, 179.07029724121094], "rel": [33, 239, 78, 999, 577], "header": ["m/z", "int.", "rel.int."], "intensity": [22225.443359375, 155144.65625, 51027.03125, 645843.3125, 373608.25]}, "n_Peak": 5, "splash": "splash10-03fr-0900000000-7d422daf81a7a192baa8", "annotation": {"header": ["m/z", "tentative_formula", "mass_error(ppm)"], "values": {"m/z": [105.0699, 133.0644, 151.0748, 161.0591, 179.0697], "mass_error(ppm)": [0.11, -2.99, -3.71, -3.77, -3.18], "tentative_formula": ["C8H9+", "C9H9O1+", "C9H11O2+", "C10H9O2+", "C10H11O3+"]}}}, "title": "Mellein; LC-ESI-ITFT; MS2; CE: 30; R=17500; [M+H]+", "authors": [{"name": "Justin B. Renaud", "marc_relator": ""}, {"name": " Mark W. Sumarah", "marc_relator": ""}, {"name": " Agriculture and Agri-Food Canada", "marc_relator": ""}], "license": "CC BY-SA", "project": null, "species": {"link": null, "name": null, "sample": null, "lineage": null}, "comments": [{"value": "isolated standard", "subtag": "CONFIDENCE"}], "compound": {"link": [{"database": "INCHIKEY", "identifier": "KWILGNNWGSNMPA-UHFFFAOYSA-N"}, {"database": "CAS", "identifier": "17397-85-2"}, {"database": "PUBCHEM", "identifier": "CID:28516"}, {"database": "CHEMSPIDER", "identifier": "26529"}, {"database": "KNAPSACK", "identifier": "C00000550"}, {"database": "COMPTOX", "identifier": "DTXSID60891794"}], "mass": 178.06299, "name": ["Mellein", "Ochracin", "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one"], "inchi": "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3", "smiles": "CC1CC2=C(C(=CC=C2)O)C(=O)O1", "classes": ["Natural Product; Fungal metabolite"], "formula": "C10H10O3", "cdk_depict": null}, "metadata": {"file_name": "MassBank-data-main/AAFC/MSBNK-AAFC-AC000003.txt", "version_ref": ""}, "accession": "MSBNK-AAFC-AC000003", "copyright": "Copyright (C) 2017", "deprecated": null, "acquisition": {"general": null, "instrument": "Q-Exactive Orbitrap Thermo Scientific", "chromatography": [{"value": "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM", "subtag": "COLUMN_NAME"}, {"value": "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min", "subtag": "FLOW_GRADIENT"}, {"value": "0.3 mL min-1", "subtag": "FLOW_RATE"}, {"value": "3.44", "subtag": "RETENTION_TIME"}, {"value": "1094", "subtag": "NAPS_RTI"}, {"value": "A H2O 0.1% FA", "subtag": "SOLVENT"}, {"value": "B ACN 0.1% FA", "subtag": "SOLVENT"}], "instrument_type": "LC-ESI-ITFT", "mass_spectrometry": [{"value": "MS2", "subtag": "MS_TYPE"}, {"value": "POSITIVE", "subtag": "ION_MODE"}, {"value": "ESI", "subtag": "IONIZATION"}, {"value": "3.9 kV", "subtag": "IONIZATION_VOLTAGE"}, {"value": "HCD", "subtag": "FRAGMENTATION_MODE"}, {"value": "30(NCE)", "subtag": "COLLISION_ENERGY"}, {"value": "17500", "subtag": "RESOLUTION"}]}, "contributor": "AAFC", "publication": "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5", "mass_spectrometry": {"focused_ion": [{"value": "161.0591", "subtag": "BASE_PEAK"}, {"value": "179.0697", "subtag": "PRECURSOR_M/Z"}, {"value": "[M+H]+", "subtag": "PRECURSOR_TYPE"}], "data_processing": [{"value": "Proteowizard", "subtag": "DEPROFILE"}, {"value": "based on Fragment ion formula determination", "subtag": "RECALIBRATE"}, {"value": "CUTOFF 0.05 Base Peak", "subtag": "INTENSITY"}]}}', 1);
INSERT INTO public.massbank (id, filename, document, metadataid) VALUES (4, 'MassBank-data-main/AAFC/MSBNK-AAFC-AC000004.txt', '{"date": {"created": "2017-07-07T00:00:00Z", "updated": "2017-07-07T00:00:00Z", "modified": "0001-01-01T00:00:00Z"}, "peak": {"peak": {"mz": [105.06990051269531, 133.06480407714844, 151.0753936767578, 161.0596923828125, 179.07029724121094], "rel": [64, 402, 69, 999, 330], "header": ["m/z", "int.", "rel.int."], "intensity": [145065.75, 897854.1875, 157199.953125, 2226461.75, 737398.3125]}, "n_Peak": 5, "splash": "splash10-03di-0900000000-23c177f284fe49e83b73", "annotation": {"header": ["m/z", "tentative_formula", "mass_error(ppm)"], "values": {"m/z": [105.0699, 133.0643, 151.0748, 161.059, 179.0696], "mass_error(ppm)": [0.11, -3.74, -3.71, -4.4, -3.74], "tentative_formula": ["C8H9+", "C9H9O1+", "C9H11O2+", "C10H9O2+", "C10H11O3+"]}}}, "title": "Mellein; LC-ESI-ITFT; MS2; CE: 35; R=17500; [M+H]+", "authors": [{"name": "Justin B. Renaud", "marc_relator": ""}, {"name": " Mark W. Sumarah", "marc_relator": ""}, {"name": " Agriculture and Agri-Food Canada", "marc_relator": ""}], "license": "CC BY-SA", "project": null, "species": {"link": null, "name": null, "sample": null, "lineage": null}, "comments": [{"value": "isolated standard", "subtag": "CONFIDENCE"}], "compound": {"link": [{"database": "INCHIKEY", "identifier": "KWILGNNWGSNMPA-UHFFFAOYSA-N"}, {"database": "CAS", "identifier": "17397-85-2"}, {"database": "PUBCHEM", "identifier": "CID:28516"}, {"database": "CHEMSPIDER", "identifier": "26529"}, {"database": "KNAPSACK", "identifier": "C00000550"}, {"database": "COMPTOX", "identifier": "DTXSID60891794"}], "mass": 178.06299, "name": ["Mellein", "Ochracin", "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one"], "inchi": "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3", "smiles": "CC1CC2=C(C(=CC=C2)O)C(=O)O1", "classes": ["Natural Product; Fungal metabolite"], "formula": "C10H10O3", "cdk_depict": null}, "metadata": {"file_name": "MassBank-data-main/AAFC/MSBNK-AAFC-AC000004.txt", "version_ref": ""}, "accession": "MSBNK-AAFC-AC000004", "copyright": "Copyright (C) 2017", "deprecated": null, "acquisition": {"general": null, "instrument": "Q-Exactive Orbitrap Thermo Scientific", "chromatography": [{"value": "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM", "subtag": "COLUMN_NAME"}, {"value": "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min", "subtag": "FLOW_GRADIENT"}, {"value": "0.3 mL min-1", "subtag": "FLOW_RATE"}, {"value": "3.44", "subtag": "RETENTION_TIME"}, {"value": "1094", "subtag": "NAPS_RTI"}, {"value": "A H2O 0.1% FA", "subtag": "SOLVENT"}, {"value": "B ACN 0.1% FA", "subtag": "SOLVENT"}], "instrument_type": "LC-ESI-ITFT", "mass_spectrometry": [{"value": "MS2", "subtag": "MS_TYPE"}, {"value": "POSITIVE", "subtag": "ION_MODE"}, {"value": "ESI", "subtag": "IONIZATION"}, {"value": "3.9 kV", "subtag": "IONIZATION_VOLTAGE"}, {"value": "HCD", "subtag": "FRAGMENTATION_MODE"}, {"value": "35(NCE)", "subtag": "COLLISION_ENERGY"}, {"value": "17500", "subtag": "RESOLUTION"}]}, "contributor": "AAFC", "publication": "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5", "mass_spectrometry": {"focused_ion": [{"value": "161.059", "subtag": "BASE_PEAK"}, {"value": "179.0697", "subtag": "PRECURSOR_M/Z"}, {"value": "[M+H]+", "subtag": "PRECURSOR_TYPE"}], "data_processing": [{"value": "Proteowizard", "subtag": "DEPROFILE"}, {"value": "based on Fragment ion formula determination", "subtag": "RECALIBRATE"}, {"value": "CUTOFF 0.05 Base Peak", "subtag": "INTENSITY"}]}}', 1);

