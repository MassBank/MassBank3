insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/AAFC/MSBNK-AAFC-AC000005.txt', '{
  "date": {
    "created": "2017-07-07T00:00:00Z",
    "updated": "2017-07-07T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        105.0698,
        115.054,
        133.0643,
        151.0747,
        161.0589,
        179.0696
      ],
      "rel": [
        422,
        36,
        999,
        39,
        708,
        56
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        1513707.125,
        134276.65625,
        3576966.75,
        143513.875,
        2536772.25,
        204606.65625
      ]
    },
    "splash": "splash10-01q9-0900000000-f556e9b53553d12b44b5",
    "n_peak": 6,
    "annotation": {
      "header": [
        "m/z",
        "tentative_formula",
        "mass_error(ppm)"
      ],
      "values": {
        "m/z": [
          105.0698,
          115.054,
          133.0643,
          151.0747,
          161.0589,
          179.0696
        ],
        "mass_error(ppm)": [
          -0.84,
          -2.05,
          -3.74,
          -4.37,
          -5.02,
          -3.74
        ],
        "tentative_formula": [
          "C8H9+",
          "C9H7+",
          "C9H9O1+",
          "C9H11O2+",
          "C10H9O2+",
          "C10H11O3+"
        ]
      }
    }
  },
  "authors": [
      {
        "name": "Justin B. Renaud",
        "marc_relator": ""
      },
      {
        "name": " Mark W. Sumarah",
        "marc_relator": ""
      },
      {
        "name": " Agriculture and Agri-Food Canada",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "isolated standard",
      "subtag": "CONFIDENCE"
    }
  ],
  "compound": {
    "link": [
      {
        "database": "INCHIKEY",
        "identifier": "KWILGNNWGSNMPA-UHFFFAOYSA-N"
      },
      {
        "database": "CAS",
        "identifier": "17397-85-2"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:28516"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "26529"
      },
      {
        "database": "KNAPSACK",
        "identifier": "C00000550"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID60891794"
      }
    ],
    "mass": 178.06299,
    "name": [
      "Mellein",
      "Ochracin",
      "8-hydroxy-3-methyl-3,4-dihydroisochromen-1-one"
    ],
    "inchi": "InChI=1S/C10H10O3/c1-6-5-7-3-2-4-8(11)9(7)10(12)13-6/h2-4,6,11H,5H2,1H3",
    "smiles": "CC1CC2=C(C(=CC=C2)O)C(=O)O1",
    "classes": [
        "Natural Product",
        "Fungal metabolite"
      ],
    "formula": "C10H10O3",
  },
  "metadata": {
    "file_name": "/MassBank-data/AAFC/MSBNK-AAFC-AC000005.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-AAFC-AC000005",
  "contributor": "AAFC",
  "copyright": "Copyright (C) 2017",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Q-Exactive Orbitrap Thermo Scientific",
    "chromatography": [
      {
        "value": "Agilent RRHD Eclipse 50 x 2 mm, 1.8 uM",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "100:0 at 0 min, 100:0 at 0.5 min, 0:100 at 3.5 min, 0:100 at 5.5 min, 100:0 at 7 min",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "0.3 mL min-1",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "3.44",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "1094",
        "subtag": "NAPS_RTI"
      },
      {
        "value": "A H2O 0.1% FA",
        "subtag": "SOLVENT"
      },
      {
        "value": "B ACN 0.1% FA",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-ITFT",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "3.9 kV",
        "subtag": "IONIZATION_VOLTAGE"
      },
      {
        "value": "HCD",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "50(NCE)",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "17500",
        "subtag": "RESOLUTION"
      }
    ]
  },
  "publication": "Renaud, J. B.; Sumarah, M. W. Data Independent Acquisition-Digital Archiving Mass Spectrometry: Application to Single Kernel Mycotoxin Analysis of Fusarium Graminearum Infected Maize. Analytical and Bioanalytical Chemistry 2016, 408 (12), 3083–91. DOI:10.1007/s00216-016-9391-5",
  "title": "Mellein; LC-ESI-ITFT; MS2; CE: 50; R=17500; [M+H]+",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "133.0643",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "179.0697",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M+H]+",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "Proteowizard",
        "subtag": "DEPROFILE"
      },
      {
        "value": "based on Fragment ion formula determination",
        "subtag": "RECALIBRATE"
      },
      {
        "value": "CUTOFF 0.05 Base Peak",
        "subtag": "INTENSITY"
      }
    ]
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Athens_Univ/MSBNK-Athens_Univ-AU229201.txt', '{
  "date": {
    "created": "2019-04-05T00:00:00Z",
    "updated": "2019-04-05T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        214.1085,
        215.111,
        216.113
      ],
      "rel": [
        999,
        125,
        7
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        2303864,
        289484,
        16528
      ]
    },
    "splash": "splash10-03di-0090000000-4ca5f2773c0d659574ef",
    "n_peak":  3,
    "annotation": {
      "header": [
        "m/z",
        "tentative_formula",
        "formula_count",
        "mass",
        "error(ppm)"
      ],
      "values": {
        "m/z": [
          214.1085,
          215.111,
          216.113
        ],
        "mass": [
          214.1087,
          215.1126,
          216.116
        ],
        "error(ppm)": [
          -1.22,
          -7.78,
          -13.6
        ],
        "formula_count": [
          1,
          1,
          1
        ],
        "tentative_formula": [
          "C11H12N5+",
          "C10[13]CH12N5+",
          "C9[13]C2H12N5+"
        ]
      }
    }
  },
  "authors":[
      {
        "name": "Nikiforos Alygizakis",
        "marc_relator": ""
      },
      {
        "name": " Katerina Galani",
        "marc_relator": ""
      },
      {
        "name": " Nikolaos Thomaidis",
        "marc_relator": ""
      },
      {
        "name": " University of Athens",
        "marc_relator": ""
      }
    ],
  "license": "CC BY",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "standard compound",
      "subtag": "CONFIDENCE"
    },
    {
      "value": "2292",
      "subtag": "INTERNAL_ID"
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "77500-04-0"
      },
      {
        "database": "CHEBI",
        "identifier": "76604"
      },
      {
        "database": "KEGG",
        "identifier": "C19255"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:62275"
      },
      {
        "database": "INCHIKEY",
        "identifier": "DVCCCQNKIYNAKB-UHFFFAOYSA-N"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "56076"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID1020801"
      }
    ],
    "mass":  213.1014454,
    "name": [
      "2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx)",
      "MeIQx",
      "3,8-dimethylimidazo[4,5-f]quinoxalin-2-amine"
    ],
    "inchi": "InChI=1S/C11H11N5/c1-6-5-13-7-3-4-8-10(9(7)14-6)15-11(12)16(8)2/h3-5H,1-2H3,(H2,12,15)",
    "smiles": "CN1C(N)=NC2=C1C=CC1=NC=C(C)N=C21",
    "classes": [
        "N/A",
        "Environmental Standard"
      ],
    "formula": "C11H11N5",
  },
  "metadata": {
    "file_name": "/MassBank-data/Athens_Univ/MSBNK-Athens_Univ-AU229201.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Athens_Univ-AU229201",
  "contributor": "Athens_Univ",
  "copyright": "Copyright (C) 2019 Department of Chemistry, University of Athens",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Bruker maXis Impact",
    "chromatography": [
      {
        "value": "Acclaim RSLC C18 2.2um, 2.1x100mm, Thermo",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "99/1 at 0-1 min, 61/39 at 3 min, 0.1/99.9 at 14-16 min, 99/1 at 16.1-20 min",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "200 uL/min at 0-3 min, 400 uL/min at 14 min, 480 uL/min at 16-19 min, 200 uL/min at 19.1-20 min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "4.075 min",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A 90:10 water:methanol with 0.01% formic acid and 5mM ammonium formate",
        "subtag": "SOLVENT"
      },
      {
        "value": "B methanol with 0.01% formic acid and 5mM ammonium formate",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "CID",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "10 eV",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "35000",
        "subtag": "RESOLUTION"
      }
    ]
  },
  "publication": null,
  "title": "2-Amino-3,8-dimethylimidazo-[4,5-f]quinoxaline (MeIQx); LC-ESI-QTOF; MS2; CE: 10 eV; R=35000; [M+H]+",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "214.1081",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "214.1087",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M+H]+",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "identity on assigned fragments and MS1",
        "subtag": "RECALIBRATE"
      },
      {
        "value": "RMassBank 2.10.0",
        "subtag": "WHOLE"
      }
    ]
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Eawag/MSBNK-Eawag-EA018353.txt', '{
  "date": {
    "created": "2014-01-14T00:00:00Z",
    "updated": "2014-01-14T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        174.0679,
        195.0234,
        230.0804,
        309.066
      ],
      "rel": [
        3,
        5,
        13,
        999
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        3134.2,
        4236.3,
        10982,
        805229.1
      ]
    },
    "splash": "splash10-0a4i-0009000000-ccda245feefab7d2bd86",
    "n_peak": 4,
    "annotation": {
      "header": [
        "m/z",
        "tentative_formula",
        "formula_count",
        "mass",
        "error(ppm)"
      ],
      "values": {
        "m/z": [
          174.0679,
          195.0234,
          230.0804,
          309.066
        ],
        "mass": [
          174.0673,
          195.0234,
          230.0809,
          309.0663
        ],
        "error(ppm)": [
          3.3,
          0.09,
          -2.23,
          -0.94
        ],
        "formula_count": [
          2,
          1,
          1,
          1
        ],
        "tentative_formula": [
          "C9H8N3O-",
          "C8H7N2O2S-",
          "C11H10N4O2-",
          "C12H13N4O4S-"
        ]
      }
    }
  },
  "authors":  [
      {
        "name": "Stravs M",
        "marc_relator": ""
      },
      {
        "name": " Schymanski E",
        "marc_relator": ""
      },
      {
        "name": " Singer H",
        "marc_relator": ""
      },
      {
        "name": " Department of Environmental Chemistry",
        "marc_relator": ""
      },
      {
        "name": " Eawag",
        "marc_relator": ""
      }
    ],
  "license": "CC BY",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "standard compound",
      "subtag": "CONFIDENCE"
    },
    {
      "value": "EAWAG_UCHEM_ID 183",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "122-11-2"
      },
      {
        "database": "CHEBI",
        "identifier": "32161"
      },
      {
        "database": "KEGG",
        "identifier": "D01142"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:5323"
      },
      {
        "database": "INCHIKEY",
        "identifier": "ZZORFUFYDOWNEF-UHFFFAOYSA-N"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "5132"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID1023607"
      }
    ],
    "mass":  310.0736,
    "name": [
      "Sulfadimethoxine",

        "4-amino-N-(2,6-dimethoxy-4-pyrimidinyl)benzenesulfonamide"
    ],
    "inchi": "InChI=1S/C12H14N4O4S/c1-19-11-7-10(14-12(15-11)20-2)16-21(17,18)9-5-3-8(13)4-6-9/h3-7H,13H2,1-2H3,(H,14,15,16)",
    "smiles": "c1(NS(c2ccc(N)cc2)(=O)=O)cc(nc(n1)OC)OC",
    "classes":  [
        "N/A",
        "Environmental Standard"
      ],
    "formula": "C12H14N4O4S",
  },
  "metadata": {
    "file_name": "/MassBank-data/Eawag/MSBNK-Eawag-EA018353.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Eawag-EA018353",
  "contributor": "Eawag",
  "copyright": "Copyright (C) 2012 Eawag, Duebendorf, Switzerland",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "LTQ Orbitrap XL Thermo Scientific",
    "chromatography": [
      {
        "value": "XBridge C18 3.5um, 2.1x50mm, Waters",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "90/10 at 0 min, 50/50 at 4 min, 5/95 at 17 min, 5/95 at 25 min, 90/10 at 25.1 min, 90/10 at 30 min",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "200 ul/min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "5.7 min",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A water with 0.1% formic acid",
        "subtag": "SOLVENT"
      },
      {
        "value": "B methanol with 0.1% formic acid",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-ITFT",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "NEGATIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "HCD",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "30 % (nominal)",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "7500",
        "subtag": "RESOLUTION"
      }
    ]
  },
  "publication": null,
  "title": "Sulfadimethoxine; LC-ESI-ITFT; MS2; CE: 30%; R=7500; [M-H]-",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "309.0653",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "309.0663",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M-H]-",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "Spline",
        "subtag": "DEPROFILE"
      },
      {
        "value": "loess on assigned fragments and MS1",
        "subtag": "RECALIBRATE"
      },
      {
        "value": "Peaks with additional N2/O included",
        "subtag": "REANALYZE"
      },
      {
        "value": "RMassBank 1.3.1",
        "subtag": "WHOLE"
      }
    ]
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Eawag_Additional_Specs/MSBNK-Eawag_Additional_Specs-ET060401.txt', '{
  "date": {
    "created": "2015-09-25T00:00:00Z",
    "updated": "2016-03-17T00:00:00Z",
    "modified": "2016-02-03T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        60.0444,
        60.0808,
        123.1162,
        141.0006,
        158.0272,
        159.0416,
        187.073,
        214.0897,
        246.1102
      ],
      "rel": [
        180,
        16,
        10,
        48,
        147,
        447,
        999,
        134,
        776
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        17595.5,
        1571.7,
        990.3,
        4683.9,
        14370,
        43520.4,
        97124.8,
        13043.94434,
        75456.7
      ]
    },
    "splash": "splash10-052s-1940000000-a515d02f980838cad28d",
    "n_peak":  9,
    "annotation": {
      "header": [
        "m/z",
        "tentative_formula",
        "formula_count",
        "mass",
        "error(ppm)"
      ],
      "values": {
        "m/z": [
          60.0444,
          60.0808,
          123.1162,
          141.0006,
          158.0272,
          159.0416,
          187.073,
          246.1102
        ],
        "mass": [
          60.0444,
          60.0808,
          123.1168,
          141.0009,
          158.0275,
          159.0416,
          187.0729,
          246.11
        ],
        "error(ppm)": [
          0.83,
          0.07,
          -4.77,
          -2.4,
          -2.01,
          0.18,
          0.74,
          0.75
        ],
        "formula_count": [
          1,
          1,
          1,
          1,
          1,
          1,
          1,
          1
        ],
        "tentative_formula": [
          "C2H6NO+",
          "C3H10N+",
          "C9H15+",
          "C9FN+",
          "C9H3FN2+",
          "C8H6F3+",
          "C10H10F3+",
          "C12H15F3NO+"
        ]
      }
    }
  },
  "authors": [
      {
        "name": "R. Gulde",
        "marc_relator": ""
      },
      {
        "name": " E. Schymanski",
        "marc_relator": ""
      },
      {
        "name": " K. Fenner",
        "marc_relator": ""
      },
      {
        "name": " Department of Environmental Chemistry",
        "marc_relator": ""
      },
      {
        "name": " Eawag",
        "marc_relator": ""
      }
    ],
  "license": "CC BY",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "Tentative identification: most likely structure (Level 3)",
      "subtag": "CONFIDENCE"
    },
    {
      "value": "604",
      "subtag": "INTERNAL_ID"
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "40552-64-5"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:38514"
      },
      {
        "database": "INCHIKEY",
        "identifier": "ZVKARXLKNIBGIR-UHFFFAOYSA-N"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "35298"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID30891589"
      }
    ],
    "mass":  245.1027,
    "name": [
      "FEN_246.1101_16.1",
      "N-desethyl-N-acetylfeniramine",
        "N-[1-[3-(trifluoromethyl)phenyl]propan-2-yl]acetamide"
    ],
    "inchi": "InChI=1S/C12H14F3NO/c1-8(16-9(2)17)6-10-4-3-5-11(7-10)12(13,14)15/h3-5,7-8H,6H2,1-2H3,(H,16,17)",
    "smiles": "CC(CC1=CC(=CC=C1)C(F)(F)F)NC(C)=O",
    "classes": [
        "N/A",
        "Environmental Transformation Products"
      ],
    "formula": "C12H14F3NO",
  },
  "metadata": {
    "file_name": "/MassBank-data/Eawag_Additional_Specs/MSBNK-Eawag_Additional_Specs-ET060401.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Eawag_Additional_Specs-ET060401",
  "contributor": "Eawag_Additional_Specs",
  "copyright": "Copyright (C) 2016 Eawag, Duebendorf, Switzerland",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Q Exactive Plus Orbitrap Thermo Scientific",
    "chromatography": [
      {
        "value": "Atlantis T3 3um, 3.0x150mm, Waters with guard column",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "95/5 at 0 min, 5/95 at 15 min, 5/95 at 20 min, 95/5 at 20.1 min, 95/5 at 25 min",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "300 uL/min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "15.8 min",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A water with 0.1% formic acid",
        "subtag": "SOLVENT"
      },
      {
        "value": "B methanol with 0.1% formic acid",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-QFT",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "HCD",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "15 (nominal)",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "17500",
        "subtag": "RESOLUTION"
      }
    ]
  },
  "publication": "Gulde, R.; Meier, U.; Schymanski, E. L.; Kohler, H.-P. E.; Helbling, D. E.; Derrer, S.; Rentsch, D.; Fenner, K. Systematic Exploration of Biotransformation Reactions of Amine-Containing Micropollutants in Activated Sludge. Environmental Science & Technology 2016, 50 (6), 2908–20. DOI:10.1021/acs.est.5b05186",
  "title": "FEN_246.1101_16.1; LC-ESI-QFT; MS2; CE: 15; R=17500; [M+H]+",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "65.0597",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "246.11",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M+H]+",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "loess on assigned fragments and MS1",
        "subtag": "RECALIBRATE"
      },
      {
        "value": "Peaks with additional N2/O included",
        "subtag": "REANALYZE"
      },
      {
        "value": "RMassBank 1.99.7",
        "subtag": "WHOLE"
      }
    ]
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Fac_Eng_Univ_Tokyo/MSBNK-Fac_Eng_Univ_Tokyo-JP009132.txt', '{
  "date": {
    "created": "2008-10-21T00:00:00Z",
    "updated": "2016-01-19T00:00:00Z",
    "modified": "2011-05-06T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        15,
        26,
        27,
        37,
        38,
        39,
        45,
        46,
        47,
        49,
        50,
        51,
        52,
        57,
        58,
        61,
        62,
        63,
        65,
        66,
        69,
        70,
        71,
        73,
        74,
        75,
        76,
        77,
        78,
        79,
        81,
        82,
        83,
        91,
        92,
        108,
        109,
        110,
        111,
        123,
        124,
        125,
        126
      ],
      "rel": [
        57,
        13,
        31,
        19,
        44,
        193,
        286,
        79,
        51,
        14,
        181,
        348,
        32,
        23,
        20,
        13,
        61,
        61,
        225,
        14,
        147,
        12,
        15,
        12,
        62,
        28,
        18,
        127,
        430,
        61,
        21,
        51,
        16,
        317,
        20,
        56,
        464,
        31,
        20,
        82,
        999,
        83,
        48
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        5.68,
        1.26,
        3.11,
        1.85,
        4.41,
        19.29,
        28.64,
        7.9,
        5.09,
        1.39,
        18.14,
        34.82,
        3.18,
        2.3,
        2.04,
        1.25,
        6.11,
        6.12,
        22.52,
        1.38,
        14.67,
        1.15,
        1.48,
        1.16,
        6.23,
        2.84,
        1.81,
        12.7,
        42.96,
        6.05,
        2.1,
        5.12,
        1.61,
        31.68,
        2.02,
        5.64,
        46.38,
        3.12,
        1.97,
        8.22,
        99.99,
        8.31,
        4.82
      ]
    },
    "splash": "splash10-0fk9-9500000000-e5cde2928e0b7e33c1cc",
    "n_peak": 43,
    "annotation": null
  },
  "authors": [
      {
        "name": "SODA AROMATIC CO.",
        "marc_relator": ""
      },
      {
        "name": " LTD.",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-NC-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": null,
  "compound": {
    "link": [
      {
        "database": "INCHIKEY",
        "identifier": "HNKJADCVZUBCPG-UHFFFAOYSA-N"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID8059217"
      }
    ],
    "mass":  124.03467,
    "name": [
 "METHYL PHENYL SULFIDE"
    ],
    "inchi": "InChI=1S/C7H8S/c1-8-7-5-3-2-4-6-7/h2-6H,1H3",
    "smiles": "CSc(c1)cccc1",
    "classes": [
        "N/A"
      ],
    "formula": "C7H8S",
  },
  "metadata": {
    "file_name": "/MassBank-data/Fac_Eng_Univ_Tokyo/MSBNK-Fac_Eng_Univ_Tokyo-JP009132.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Fac_Eng_Univ_Tokyo-JP009132",
  "contributor": "Fac_Eng_Univ_Tokyo",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "HITACHI M-80B",
    "chromatography": null,
    "instrument_type": "EI-B",
    "mass_spectrometry": [
      {
        "value": "MS",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "70 eV",
        "subtag": "IONIZATION_ENERGY"
      }
    ]
  },
  "publication": null,
  "title": "METHYL PHENYL SULFIDE; EI-B; MS",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "[M]+*",
        "subtag": "ION_TYPE"
      }
    ],
    "data_processing": null
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Keio_Univ/MSBNK-Keio_Univ-KO009105.txt', '{
  "date": {
    "created": "2008-05-12T00:00:00Z",
    "updated": "2012-10-22T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        56.2,
        58.2,
        67.2,
        68.2,
        70.2,
        76.7,
        79.2,
        80.0,
        81.1,
        82.0,
        85.0,
        91.1,
        93.1,
        94.0,
        95.1,
        96.1,
        99.1,
        108.1,
        109.1,
        110.1,
        111.0,
        113.1,
        119.1,
        123.1,
        125.1,
        134.1,
        136.1,
        137.1,
        151.1,
        162.0,
        179.1,
        180.1,
        197.2
      ],
      "rel": [
        15,
        16,
        133,
        4,
        13,
        10,
        28,
        5,
        129,
        37,
        6,
        20,
        99,
        13,
        58,
        20,
        687,
        13,
        67,
        24,
        83,
        36,
        363,
        23,
        26,
        105,
        999,
        27,
        285,
        8,
        80,
        110,
        4
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        7.30,
        8.10,
        66.36,
        1.80,
        6.70,
        4.90,
        14.00,
        2.60,
        64.28,
        18.49,
        3.00,
        10.00,
        49.50,
        6.69,
        28.99,
        10.20,
        342.46,
        6.60,
        33.39,
        12.19,
        41.20,
        17.90,
        180.85,
        11.40,
        12.89,
        52.21,
        498.25,
        13.29,
        142.24,
        3.90,
        39.87,
        54.97,
        2.20
      ]
    },
    "splash": "splash10-000j-5900000000-8ad8423e2b359b500863",
    "n_peak":  33,
    "annotation": null
  },
  "authors": [
      {
        "name": "Ojima Y",
        "marc_relator": ""
      },
      {
        "name": " Kakazu Y",
        "marc_relator": ""
      },
      {
        "name": " Horai H",
        "marc_relator": ""
      },
      {
        "name": " Soga T",
        "marc_relator": ""
      },
      {
        "name": " Institute for Advanced Biosciences",
        "marc_relator": ""
      },
      {
        "name": " Keio Univ.",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-NC-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "KEIO_ID D075",
      "subtag": ""
    },
    {
      "value": "[MS3] KO009104",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "533-48-2"
      },
      {
        "database": "CHEBI",
        "identifier": "16691"
      },
      {
        "database": "KEGG",
        "identifier": "C01909"
      },
      {
        "database": "NIKKAJI",
        "identifier": "J9.406D"
      },
      {
        "database": "PUBCHEM",
        "identifier": "SID:5017"
      },
      {
        "database": "INCHIKEY",
        "identifier": "AUTOLBMXDDTRRT-JGVFFNPUSA-N"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID50876136"
      }
    ],
    "mass":  214.13174,
    "name": [
      "Desthiobiotin",
      "Dethiobiotin"
    ],
    "inchi": "InChI=1S/C10H18N2O3/c1-7-8(12-10(15)11-7)5-3-2-4-6-9(13)14/h7-8H,2-6H2,1H3,(H,13,14)(H2,11,12,15)/t7-,8+/m0/s1",
    "smiles": "OC(=O)CCCCCC(N1)C(C)NC(=O)1",
    "classes":  [
        "N/A"
      ],
    "formula": "C10H18N2O3",
  },
  "metadata": {
    "file_name": "/MassBank-data/Keio_Univ/MSBNK-Keio_Univ-KO009105.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Keio_Univ-KO009105",
  "contributor": "Keio_Univ",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "LC/MSD Trap XCT, Agilent Technologies",
    "chromatography": null,
    "instrument_type": "LC-ESI-IT",
    "mass_spectrometry": [
      {
        "value": "MS4",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "0.70/0.70/0.60",
        "subtag": "COLLISION_ENERGY"
      }
    ]
  },
  "publication": null,
  "title": "Desthiobiotin; LC-ESI-IT; MS4; m/z: 215/197/179; [M+H]+",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "215/197/179",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M+H]+",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "LC/MSD Trap Control and Data Analysis",
        "subtag": "WHOLE"
      }
    ]
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/MSSJ/MSBNK-MSSJ-MSJ00284.txt', '{
  "date": {
    "created": "2020-03-18T00:00:00Z",
    "updated": "2020-03-18T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        31.9901,
        34.9691,
        41.0392,
        69.0342,
        97.0289,
        131.001,
        149.9992,
        166.9774,
        185.9761
      ],
      "rel": [
        97,
        80,
        999,
        63,
        97,
        144,
        164,
        168,
        152
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        0.02542,
        0.02094,
        0.26061,
        0.01645,
        0.02531,
        0.03766,
        0.04276,
        0.04392,
        0.03962
      ]
    },
    "splash": "splash10-0006-9400000000-6b99aa683e8584601a75",
    "n_peak": 9,
    "annotation": null
  },
  "authors":[
      {
        "name": "Atsushi Yamamoto",
        "marc_relator": ""
      },
      {
        "name": " Faculty of Environmental Studies",
        "marc_relator": ""
      },
      {
        "name": " Tottori University of Environmental Studies",
        "marc_relator": ""
      },
      {
        "name": " 1-1",
        "marc_relator": ""
      },
      {
        "name": " Wakabadai-kita",
        "marc_relator": ""
      },
      {
        "name": " Tottori City",
        "marc_relator": ""
      },
      {
        "name": " Tottori 689-1111",
        "marc_relator": ""
      },
      {
        "name": " Japan.",
        "marc_relator": ""
      }
    ],
  "license": "CC BY",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "The sample was injected by direct infusion.",
      "subtag": ""
    },
    {
      "value": "This record was created by the financial support of MEXT/JSPS KAKENHI Grant Number 19HP8024 to the Mass Spectrometry Society of Japan.",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "110956-75-7"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "9888955"
      },
      {
        "database": "INCHIKEY",
        "identifier": "JZPKLLLUDLHCEL-UHFFFAOYSA-N"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:11714234"
      }
    ],
    "mass":  353.083,
    "name": [
      "Pentoxazone"
    ],
    "inchi": "InChI=1S/C17H17ClFNO4/c1-9(2)15-16(21)20(17(22)24-15)13-8-14(11(18)7-12(13)19)23-10-5-3-4-6-10/h7-8,10H,3-6H2,1-2H3",
    "smiles": "CC(=C1C(=O)N(C(=O)O1)c2cc(c(cc2F)Cl)OC3CCCC3)C",
    "classes":[
        "Non-natural product"
      ],
    "formula": "C17H17ClFNO4",
  },
  "metadata": {
    "file_name": "/MassBank-data/MSSJ/MSBNK-MSSJ-MSJ00284.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-MSSJ-MSJ00284",
  "contributor": "MSSJ",
  "copyright": "Atsushi Yamamoto, Faculty of Environmental Studies, Tottori University of Environmental Studies, 1-1, Wakabadai-kita, Tottori City, Tottori 689-1111, Japan.",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "X500R QTOF (AB Sciex LLC, USA)",
    "chromatography": null,
    "instrument_type": "ESI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "NEGATIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "60 V",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "CID",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      }
    ]
  },
  "publication": null,
  "title": "Pentoxazone; ESI-QTOF; MS2; NEGATIVE; [M-H]-; CID; 60 V",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "352.0757",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M-H]-",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": null
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/RIKEN/MSBNK-RIKEN-PR100978.txt', '{
  "date": {
    "created": "2010-06-21T00:00:00Z",
    "updated": "2016-01-19T00:00:00Z",
    "modified": "2011-05-06T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        107.0143,
        109.0299,
        121.0298,
        151.0035,
        163.0036,
        178.9989,
        255.0311,
        301.0353,
        302.0432,
        477.0669,
        478.0759
      ],
      "rel": [
        79,
        57,
        84,
        352,
        63,
        169,
        71,
        999,
        82,
        472,
        51
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        370.8,
        267.7,
        395.4,
        1650,
        295.2,
        793.8,
        333.3,
        4687,
        386,
        2215,
        237.5
      ]
    },
    "splash": "splash10-0udi-0609400000-9fd50528da25d66adfc7",
    "n_peak":  11,
    "annotation": null
  },
  "authors":  [
      {
        "name": "Matsuda F",
        "marc_relator": ""
      },
      {
        "name": " Suzuki M",
        "marc_relator": ""
      },
      {
        "name": " Sawada Y",
        "marc_relator": ""
      },
      {
        "name": " Plant Science Center",
        "marc_relator": ""
      },
      {
        "name": " RIKEN.",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "Acquisition and generation of the data is financially supported in part by CREST/JST.",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "22688-79-5"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "4438874"
      },
      {
        "database": "KNAPSACK",
        "identifier": "C00005376"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:5274585"
      },
      {
        "database": "INCHIKEY",
        "identifier": "DUBCCGAQYVUYEU-ZUGPOPFOSA-N"
      },
      {
        "database": "COMPTOX",
        "identifier": "DTXSID70945358"
      }
    ],
    "mass": 478.07474,
    "name": [
      "Quercetin-3-Glucuronide",
      "Quer-3-GlcA",
      "Miquelianin",
      "Querciturone"
    ],
    "inchi": "InChI=1S/C21H18O13/c22-7-4-10(25)12-11(5-7)32-17(6-1-2-8(23)9(24)3-6)18(13(12)26)33-21-16(29)14(27)15(28)19(34-21)20(30)31/h1-5,14-16,19,21-25,27-29H,(H,30,31)/t14-,15-,16+,19-,21+/m0/s1",
    "smiles": "OC(=O)C(O1)C(O)C(O)C(O)C1OC(C(=O)3)=C(Oc(c4)c(c(O)cc(O)4)3)c(c2)cc(O)c(O)c2",
    "classes":  [
        "Flavonoid"
      ],
    "formula": "C21H18O13",
  },
  "metadata": {
    "file_name": "/MassBank-data/RIKEN/MSBNK-RIKEN-PR100978.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-RIKEN-PR100978",
  "contributor": "RIKEN",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "UPLC Q-Tof Premier, Waters",
    "chromatography": [
      {
        "value": "3.0 kV",
        "subtag": "CAPILLARY_VOLTAGE"
      },
      {
        "value": "23.0 V",
        "subtag": "SAMPLING_CONE"
      },
      {
        "value": "A CH3CN(0.1%HCOOH)",
        "subtag": "SOLVENT"
      },
      {
        "value": "B H2O(0.1%HCOOH)",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "NEGATIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "Ramp 5-60 V",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "Continuum",
        "subtag": "DATAFORMAT"
      },
      {
        "value": "600.0 L/Hr",
        "subtag": "DESOLVATION_GAS_FLOW"
      },
      {
        "value": "400 C",
        "subtag": "DESOLVATION_TEMPERATURE"
      },
      {
        "value": "LOW-ENERGY CID",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "120 C",
        "subtag": "SOURCE_TEMPERATURE"
      }
    ]
  },
  "publication": null,
  "title": "Quercetin-3-Glucuronide; LC-ESI-QTOF; MS2; CE:Ramp 5-60 V; [M-H]-",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "477.06692",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M-H]-",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": null
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/RIKEN/MSBNK-RIKEN-PR309089.txt', '{
  "date": {
    "created": "2019-03-28T00:00:00Z",
    "updated": "2019-03-28T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        57.08413,
        113.09826,
        172.09279,
        177.12296,
        195.13672,
        196.14641,
        197.18631,
        223.43452,
        233.15977,
        277.21619,
        295.22772
      ],
      "rel": [
        12,
        13,
        15,
        13,
        38,
        13,
        13,
        19,
        12,
        175,
        999
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        18.0,
        20.0,
        24.0,
        20.0,
        59.0,
        20.0,
        20.0,
        29.0,
        19.0,
        272.0,
        1553.0
      ]
    },
    "splash": "splash10-0002-0090000000-3b4035f10b24d4c3f5a0",
    "n_peak":  11,
    "annotation": null
  },
  "authors":  [
      {
        "name": "Tetsuya Mori",
        "marc_relator": ""
      },
      {
        "name": " Center for Sustainable Resource Science",
        "marc_relator": ""
      },
      {
        "name": " RIKEN",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-NC-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "Annotation level-3",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "INCHIKEY",
        "identifier": "HNICUWMFWZBIFP-UHFFFAOYSA-N"
      }
    ],
    "mass": 296.451,
    "name": [
"FA 18:2+1O"
    ],
    "inchi": "InChI=1S/C18H32O3/c1-2-3-11-14-17(19)15-12-9-7-5-4-6-8-10-13-16-18(20)21/h7,9,12,15,17,19H,2-6,8,10-11,13-14,16H2,1H3,(H,20,21)",
    "smiles": "O=C(O)CCCCCCCC=CC=CC(O)CCCCC",
    "classes":  [
        "Oxidized fatty acids"
      ],
    "formula": "C18H32O3",
  },
  "metadata": {
    "file_name": "/MassBank-data/RIKEN/MSBNK-RIKEN-PR309089.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-RIKEN-PR309089",
  "contributor": "RIKEN",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "LC, Waters Acquity UPLC System; MS, Waters Xevo G2 Q-Tof",
    "chromatography": [
      {
        "value": "+3.00 kV",
        "subtag": "CAPILLARY_VOLTAGE"
      },
      {
        "value": "Acquity bridged ethyl hybrid C18 (1.7 um, 2.1 mm * 100 mm, Waters)",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "40 C",
        "subtag": "COLUMN_TEMPERATURE"
      },
      {
        "value": "A/B = (99.5%/0.5% at 0 min, 99.5%/0.5% at 0.1 min, 20%/80% at 10 min, 0.5%/99.5% at 10.1 min, 0.5%/99.5% at 12.0 min, 99.5%/0.5% at 12.1 min, 99.5%/0.5% at 15.0 min)",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "0.3 ml/min at 0 min, 0.3 ml/min at 10 min, 0.4 ml/min at 10.1 min, 0.4 ml/min at 14.4 min, 0.3 ml/min at 14.5 min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "9.57",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A water including 0.1% formic acid",
        "subtag": "SOLVENT"
      },
      {
        "value": "B acetonitrile including 0.1% formic acid",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-ESI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "NEGATIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "6V",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "800/h",
        "subtag": "DESOLVATION_GAS_FLOW"
      },
      {
        "value": "450 C",
        "subtag": "DESOLVATION_TEMPERATURE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      }
    ]
  },
  "publication":
    "Tsugawa H., Nakabayashi R., Mori T., Yamada Y., Takahashi M., Rai A., Sugiyama R., Yamamoto H., Nakaya T., Yamazaki M., Kooke R., Bac-Molenaar JA., Oztolan-Erol N., Keurentjes JJB., Arita M., Saito K. (2019) \"A cheminformatics approach to characterize metabolomes in stable-isotope-labeled organisms\" Nature Methods 16(4):295-298. [doi:10.1038/s41592-019-0358-2]",
  "title": "FA 18:2+1O; LC-ESI-QTOF; MS2",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "[M-H]-",
        "subtag": "PRECURSOR_TYPE"
      },
      {
        "value": "295.2272",
        "subtag": "PRECURSOR_M/Z"
      }
    ],
    "data_processing": null
  }
}', 1);
insert into public.massbank (filename, document, metadataid)
values ('/MassBank-data/Washington_State_Univ/MSBNK-Washington_State_Univ-BML81902.txt', '{
  "date": {
    "created": "2012-10-26T00:00:00Z",
    "updated": "2016-01-19T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        249.1484765
      ],
      "rel": [
        999
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        310073
      ]
    },
    "splash": "splash10-0002-0090000000-b81b1903703b01f61d7d",
    "n_peak": 1,
    "annotation": null
  },
  "authors": [
      {
        "name": "Cuthbertson DJ",
        "marc_relator": ""
      },
      {
        "name": " Johnson SR",
        "marc_relator": ""
      },
      {
        "name": " Lange BM",
        "marc_relator": ""
      },
      {
        "name": " Institute of Biological Chemistry",
        "marc_relator": ""
      },
      {
        "name": " Washington State University",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "relative retention time with respect to 9-anthracene Carboxylic Acid is 1.002",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CAS",
        "identifier": "20554-84-1"
      },
      {
        "database": "CHEMSPIDER",
        "identifier": "4554343"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:6473881"
      },
      {
        "database": "INCHIKEY",
        "identifier": "KTEXNACQROZXEV-SLXBATTESA-N"
      }
    ],
    "mass": 248.141245,
    "name": [
     "Parthenolide"
    ],
    "inchi": "InChI=1S/C15H20O3/c1-9-5-4-8-15(3)13(18-15)12-11(7-6-9)10(2)14(16)17-12/h5,11-13H,2,4,6-8H2,1,3H3/b9-5+/t11-,12-,13-,15+/m0/s1",
    "smiles": "C/C/1=C\\CC[C@@]2([C@@H](O2)[C@@H]3[C@@H](CC1)C(=C)C(=O)O3)C",
    "classes": [
        "N/A"
      ],
    "formula": "C15H20O3",
  },
  "metadata": {
    "file_name": "/MassBank-data/Washington_State_Univ/MSBNK-Washington_State_Univ-BML81902.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-Washington_State_Univ-BML81902",
  "contributor": "Washington_State_Univ",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Agilent 1200 RRLC; Agilent 6520 QTOF",
    "chromatography": [
      {
        "value": "Agilent C8 Cartridge Column 2.1X30mm 3.5 micron (guard); Agilent SB-Aq 2.1x50mm 1.8 micron (analytical)",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "60 C",
        "subtag": "COLUMN_TEMPERATURE"
      },
      {
        "value": "linear from 98A/2B at 0 min to 2A/98B at 13 min, hold 6 min at 2A/98B, reequilibration 98A/2B (5 min)",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "0.6 ml/min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "7.394",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A water with 0.2% acetic acid",
        "subtag": "SOLVENT"
      },
      {
        "value": "B methanol with 0.2% acetic acid",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "LC-APCI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "m/z 100-1000",
        "subtag": "SCANNING"
      }
    ]
  },
  "publication": null,
  "title": "Parthenolide; LC-APCI-QTOF; MS; POSITIVE",
  "mass_spectrometry": {
    "focused_ion": null,
    "data_processing": null
  }
}', 1);
INSERT INTO public.massbank (filename, document, metadataid)
VALUES ('/MassBank3/test-data/MSBNK-test-TST00001.txt', '{
  "date": {
    "created": "2017-07-07T00:00:00Z",
    "updated": "2017-07-07T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        185.1073,
        213.1022,
        258.1237
      ],
      "rel": [
        312,
        999,
        222
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        73653728,
        235010720,
        52446636
      ]
    },
    "splash": "splash10-03di-0290000000-8035e4fe85235c78b955",
    "n_peak":  3,
    "annotation": null
  },
  "authors":  [
      {
        "name": "Megan J. Kelman",
        "marc_relator": ""
      },
      {
        "name": " Justin B. Renaud",
        "marc_relator": ""
      },
      {
        "name": " Mark W. Sumarah",
        "marc_relator": ""
      },
      {
        "name": " Agriculture and Agri-Food Canada",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": null,
  "compound": {
    "link": null,
    "mass":  487.22194,
    "name": [
 "Fiscalin C"
    ],
    "inchi": "InChI=1S/C27H29N5O4/c1-14(2)20-21-28-17-11-7-5-9-15(17)23(34)31(21)19(22(33)29-20)13-27(36)16-10-6-8-12-18(16)32-24(27)30-26(3,4)25(32)35/h5-12,14,19-20,24,30,36H,13H2,1-4H3,(H,29,33)/t19-,20+,24-,27-/m1/s1",
    "smiles": "CC(C)[C@H]1C2=NC3=CC=CC=C3C(=O)N2[C@@H](C(=O)N1)C[C@@]4([C@@H]5NC(C(=O)N5C6=CC=CC=C64)(C)C)O",
    "classes":[
        "Natural Product"
      ],
    "formula": "C27H29N5O4",
  },
  "metadata": {
    "file_name": "/MassBank3/test-data/MSBNK-test-TST00001.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-test-TST00001",
  "contributor": "test",
  "copyright": null,
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Q-Exactive Orbitrap Thermo Scientific",
    "chromatography": null,
    "instrument_type": "LC-ESI-ITFT",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      }
    ]
  },
  "publication": null,
  "title": "Fiscalin C; LC-ESI-ITFT; MS2; CE: 30; R=17500; [M+H]+",
  "mass_spectrometry": {
    "focused_ion": null,
    "data_processing": null
  }
}', 1);
INSERT INTO public.massbank (filename, document, metadataid)
VALUES ('/MassBank3/test-data/MSBNK-test-TST00002.txt', '{
  "date": {
    "created": "2009-11-24T00:00:00Z",
    "updated": "2016-01-19T00:00:00Z",
    "modified": "2011-05-11T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        1278.12,
        1279.11,
        1279.18,
        1306.21,
        1309.13,
        1366.03,
        1375.23,
        1527.6,
        1569.08,
        1591.14,
        1595.21,
        1597.12,
        1598.11,
        1599.07,
        1620.3,
        1620.8,
        1621.18,
        1843.21,
        1860.16,
        1861.17,
        1862.18,
        1863.19,
        1864.22,
        1866.26,
        1867.23,
        1871.18,
        1876.14,
        1877.14,
        1878.13,
        1879.19,
        1882.18,
        1883.18,
        1884.18,
        1885.2,
        1886.19,
        1888.2,
        1889.21,
        1890.21,
        1891.22,
        1892.24,
        1893.23,
        1894.24,
        1895.21,
        1897.14,
        1898.15,
        1899.16,
        1900.17,
        1902.16,
        1903.2,
        1904.19,
        1905.2,
        1906.2,
        1907.23,
        1908.19,
        1910.21,
        1911.21,
        1912.21,
        1913.22,
        1914.21,
        1915.2,
        1920.18,
        1921.21,
        1922.19,
        1926.2,
        1927.19,
        1928.2,
        1929.21,
        1930.2,
        1931.32,
        1932.22,
        1933.23,
        1934.23,
        1935.22,
        1943.2,
        1948.24,
        1949.22,
        1950.22,
        1960.26,
        1965.23,
        1971.32,
        2064.29,
        2091.32,
        2092.3,
        2136.33
      ],
      "rel": [
        156,
        135,
        142,
        184,
        128,
        123,
        222,
        138,
        142,
        151,
        135,
        199,
        174,
        141,
        207,
        203,
        280,
        151,
        690,
        626,
        405,
        216,
        167,
        139,
        123,
        128,
        226,
        213,
        146,
        126,
        379,
        415,
        266,
        184,
        138,
        999,
        859,
        643,
        315,
        183,
        141,
        133,
        111,
        126,
        244,
        198,
        166,
        146,
        143,
        437,
        388,
        292,
        169,
        142,
        606,
        514,
        364,
        201,
        148,
        142,
        216,
        164,
        136,
        280,
        277,
        194,
        158,
        142,
        130,
        405,
        377,
        268,
        199,
        148,
        209,
        194,
        172,
        115,
        141,
        128,
        134,
        137,
        157,
        123
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        205,
        177,
        186,
        242,
        168,
        162,
        291,
        181,
        187,
        198,
        177,
        261,
        228,
        185,
        272,
        266,
        367,
        198,
        905,
        822,
        531,
        284,
        219,
        183,
        162,
        168,
        297,
        280,
        192,
        165,
        497,
        545,
        349,
        242,
        181,
        1311,
        1127,
        844,
        413,
        240,
        185,
        175,
        146,
        165,
        320,
        260,
        218,
        191,
        188,
        574,
        509,
        383,
        222,
        186,
        795,
        674,
        478,
        264,
        194,
        187,
        284,
        215,
        179,
        368,
        363,
        254,
        207,
        187,
        170,
        532,
        495,
        352,
        261,
        194,
        274,
        255,
        226,
        151,
        185,
        168,
        176,
        180,
        206,
        162
      ]
    },
    "splash": "splash10-03dr-0000010098-a1f70871442a6d6662d3",
    "n_peak":  84,
    "annotation": {
      "header": [
        "m/z",
        "ion"
      ],
      "values": {
        "ion": [
          "[LH-2NeuAc+Na]+",
          "[M-2NeuAc+Na]+",
          "[M-NeuAc+Na]+",
          "[LH+Na]+",
          "[LH+K]+",
          "[LH-H+2Na]+",
          "[M+Na]+",
          "[LH-H+K+Na]+",
          "[M+K]+",
          "[M-H+2Na]+",
          "[LH-2H+K+2Na]+",
          "[M-H+K+Na]+",
          "[M-2H+3Na]+",
          "[M-2H+K+2Na]+"
        ],
        "m/z": [
          1278.12,
          1306.21,
          1597.12,
          1860.16,
          1876.14,
          1882.18,
          1888.2,
          1898.15,
          1904.19,
          1910.21,
          1920.18,
          1926.2,
          1932.22,
          1948.24
        ]
      }
    }
  },
  "authors": [
      {
        "name": "Wada Y",
        "marc_relator": ""
      },
      {
        "name": " Osaka Medical Center for Maternal and Child Health",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": "my test project",
  "species": {
    "link": [
      {
        "database": "NCBI-TAXONOMY",
        "identifier": "9913"
      }
    ],
    "name": "Bos taurus",
    "Sample": [
 "brain"
    ],
    "lineage": [
        "cellular organisms",
        "Eukaryota",
        "Fungi/Metazoa group",
        "Metazoa",
        "Eumetazoa",
        "Bilateria",
        "Coelomata",
        "Deuterostomia",
        "Chordata",
        "Craniata",
        "Vertebrata",
        "Gnathostomata",
        "Teleostomi",
        "Euteleostomi",
        "Sarcopterygii",
        "Tetrapoda",
        "Amniota",
        "Mammalia",
        "Theria",
        "Eutheria",
        "Laurasiatheria",
        "Cetartiodactyla",
        "Ruminantia",
        "Pecora",
        "Bovidae",
        "Bovinae",
 "Bos"
      ]
  },
  "comments": [
    {
      "value": "[Chemical] The ceramide part has 38 carbons and 1 double bond (38:1), but its structure cannot be decided.  The displaying structure is GD1a d18:1-20:0.",
      "subtag": ""
    },
    {
      "value": "Profile spectrum of this record is given as a JPEG file.",
      "subtag": ""
    },
    {
      "value": "MCH00001.jpg",
      "subtag": "[Profile]"
    }
  ],
  "compound": {
    "link": [
      {
        "database": "INCHIKEY",
        "identifier": "UPMLUBZFFWELOX-IOFMCULOSA-N"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:137628549"
      }
    ],
    "mass":  1865.00337,
    "name": [
      "Disialoganglioside GD1a",
      "another name"

    ],
    "inchi": "InChI=1S/C86H152N4O39/c1-6-8-10-12-14-16-18-20-21-22-23-25-27-29-31-33-35-37-60(105)90-50(51(100)36-34-32-30-28-26-24-19-17-15-13-11-9-7-2)46-118-80-69(111)68(110)72(58(44-95)121-80)123-82-71(113)78(129-86(84(116)117)39-53(102)62(88-48(4)98)76(127-86)65(107)55(104)41-92)73(59(45-96)122-82)124-79-63(89-49(5)99)74(66(108)56(42-93)119-79)125-81-70(112)77(67(109)57(43-94)120-81)128-85(83(114)115)38-52(101)61(87-47(3)97)75(126-85)64(106)54(103)40-91/h34,36,50-59,61-82,91-96,100-104,106-113H,6-33,35,37-46H2,1-5H3,(H,87,97)(H,88,98)(H,89,99)(H,90,105)(H,114,115)(H,116,117)/b36-34+/t50-,51+,52-,53-,54+,55+,56+,57+,58+,59+,61+,62+,63+,64?,65?,66-,67-,68+,69+,70+,71+,72+,73-,74+,75+,76+,77-,78+,79-,80+,81-,82-,85-,86-/m0/s1",
    "smiles": "CCCCCCCCCCCCCCCCCCCC(=O)N[C@@H](CO[C@H]1[C@@H]([C@H]([C@@H]([C@H](O1)CO)O[C@H]2[C@@H]([C@H]([C@H]([C@H](O2)CO)O[C@H]3[C@@H]([C@H]([C@H]([C@H](O3)CO)O)O[C@H]4[C@@H]([C@H]([C@H]([C@H](O4)CO)O)O[C@@]5(C[C@@H]([C@H]([C@@H](O5)C([C@@H](CO)O)O)NC(=O)C)O)C(=O)O)O)NC(=O)C)O[C@@]6(C[C@@H]([C@H]([C@@H](O6)C([C@@H](CO)O)O)NC(=O)C)O)C(=O)O)O)O)O)[C@@H](/C=C/CCCCCCCCCCCCC)O",
    "classes":  [
        "Natural Product, Glycolipid",
        "Ceramide",
        "Ganglioside"
      ],
    "formula": "C86H152N4O39",
  },
  "metadata": {
    "file_name": "/MassBank3/test-data/MSBNK-test-TST00002.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-test-TST00002",
  "contributor": "test",
  "copyright": "Copyright (C) 2019 just a test",
  "deprecated": null,
  "acquisition": {
    "general": null,
    "instrument": "Voyager DE-PRO, Applied Biosystems",
    "chromatography": [
      {
        "value": "Acclaim RSLC C18 2.2um, 2.1x100mm, Thermo",
        "subtag": "COLUMN_NAME"
      },
      {
        "value": "99/1 at 0-1 min, 61/39 at 3 min, 0.1/99.9 at 14-16 min, 99/1 at 16.1-20 min",
        "subtag": "FLOW_GRADIENT"
      },
      {
        "value": "200 uL/min at 0-3 min, 400 uL/min at 14 min, 480 uL/min at 16-19 min, 200 uL/min at 19.1-20 min",
        "subtag": "FLOW_RATE"
      },
      {
        "value": "5.680 min",
        "subtag": "RETENTION_TIME"
      },
      {
        "value": "A 90:10 water:methanol with 0.01% formic acid and 5mM ammonium formate",
        "subtag": "SOLVENT"
      },
      {
        "value": "B methanol with 0.01% formic acid and 5mM ammonium formate",
        "subtag": "SOLVENT"
      }
    ],
    "instrument_type": "MALDI-TOF",
    "mass_spectrometry": [
      {
        "value": "MS",
        "subtag": "MS_TYPE"
      },
      {
        "value": "POSITIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "UV 337 nm nitrogen lazer, 20 Hz, 10 nsec",
        "subtag": "LASER"
      },
      {
        "value": "DHB",
        "subtag": "MATRIX"
      },
      {
        "value": "500 pmol",
        "subtag": "SAMPLE_DRIPPING"
      },
      {
        "value": "[MS, MS:1003294, electron activated dissociation, ]",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "15 eV",
        "subtag": "KINETIC_ENERGY"
      },
      {
        "value": "6500 nA",
        "subtag": "ELECTRON_CURRENT"
      },
      {
        "value": "65 ms",
        "subtag": "REACTION_TIME"
      }
    ]
  },
  "publication": "Beisken S et al (2014) Scientific Data, 1:140029, DOI:10.1038/sdata.2014.29. http://www.ebi.ac.uk/metabolights/MTBLS38",
  "title": "Disialoganglioside GD1a; MALDI-TOF; MS; Pos",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "324.2092",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "324.207",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M+H]+",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": [
      {
        "value": "identity on assigned fragments and MS1",
        "subtag": "RECALIBRATE"
      },
      {
        "value": "RMassBank 1.99.10",
        "subtag": "WHOLE"
      }
    ]
  }
}', 1);
INSERT INTO public.massbank (filename, document, metadataid)
VALUES ('/MassBank3/test-data/MSBNK-test-TST00003.txt', '{
  "date": {
    "created": "2018-11-21T00:00:00Z",
    "updated": "2018-11-21T00:00:00Z",
    "modified": "0001-01-01T00:00:00Z"
  },
  "peak": {
    "peak": {
      "mz": [
        59.013471921284996,
        95.0502389272054,
        121.1022351582845,
        149.13346735636392,
        165.09201685587564,
        194.09474436442056,
        281.22726186116535,
        299.2378336588542,
        325.2170130411784,
        343.22746022542316
      ],
      "rel": [
        22,
        58,
        999,
        254,
        338,
        164,
        271,
        76,
        115,
        824
      ],
      "header": [
        "m/z",
        "int.",
        "rel.int."
      ],
      "intensity": [
        47825.663583333335,
        123675.15916666668,
        2119825.3000000003,
        538442.9091666666,
        717615.9775,
        348560.26666666666,
        577177.7541666667,
        162688.84041666667,
        246360.69083333333,
        1749842.5083333335
      ]
    },
    "splash": "splash10-00dl-0914000000-bad728fe323f6890656d",
    "n_peak":  10,
    "annotation": {
      "header": [
        "m/z",
        "annotation",
        "exact_mass",
        "error(ppm)"
      ],
      "values": {
        "m/z": [
          59.013471921284996,
          95.0502389272054,
          121.1022351582845,
          149.13346735636392,
          165.09201685587564,
          194.09474436442056,
          281.22726186116535,
          299.2378336588542,
          325.2170130411784,
          343.22746022542316
        ],
        "annotation": [
          59.013,
          95.05,
          121.102,
          149.133,
          165.092,
          194.095,
          281.227,
          299.238,
          325.217,
          "precursor"
        ],
        "error(ppm)": [
          2.913263365927882,
          0.40954364535633475,
          0.29031912309532387,
          1.1221931248150303,
          0.7078231920609128,
          0.7437838072718687,
          -0.1356156911126373,
          0.1124819597449277,
          -0.2673869905083813,
          -1.1896746249719279
        ],
        "exact_mass": [
          59.0133,
          95.0502,
          121.1022,
          149.1333,
          165.0919,
          194.0946,
          281.2273,
          299.2378,
          325.2171,
          343.227868554909
        ]
      }
    }
  },
  "authors":  [
      {
        "name": "Nils Hoffmann",
        "marc_relator": ""
      },
      {
        "name": " Dominik Kopczynski",
        "marc_relator": ""
      },
      {
        "name": " Bing Peng",
        "marc_relator": ""
      }
    ],
  "license": "CC BY-SA",
  "project": null,
  "species": {
    "link": null,
    "name": null,
    "Sample": null,
    "lineage": null
  },
  "comments": [
    {
      "value": "standard compound",
      "subtag": "CONFIDENCE"
    },
    {
      "value": "NATIVE_RUN_ID QExHF03_NM_0001275.mzML",
      "subtag": ""
    },
    {
      "value": "PROCESSING averaging of repeated ion fragments at 20.0 eV within 5 ppm window [MS, MS:1000575, mean of spectra, ]",
      "subtag": ""
    }
  ],
  "compound": {
    "link": [
      {
        "database": "CHEBI",
        "identifier": "CHEBI:72794"
      },
      {
        "database": "LIPIDMAPS",
        "identifier": "LMFA04000028"
      },
      {
        "database": "INCHIKEY",
        "identifier": "LTERDCBCHFKFRI-BGKMTWLOSA-N"
      },
      {
        "database": "PUBCHEM",
        "identifier": "CID:11631564"
      }
    ],
    "mass": 344.23514,
    "name": [
     "11-HDoHE"

    ],
    "inchi": "InChI=1S/C22H32O3/c1-2-3-4-5-6-7-9-12-15-18-21(23)19-16-13-10-8-11-14-17-20-22(24)25/h3-4,6-7,10-16,19,21,23H,2,5,8-9,17-18,20H2,1H3,(H,24,25)/b4-3-,7-6-,13-10-,14-11-,15-12-,19-16+",
    "smiles": "CC\\C=C/C\\C=C/C\\C=C/CC(O)\\C=C\\C=C/C\\C=C/CCC(O)=O",
    "classes": [
        "Natural Product",
        "Lipid Standard"
      ],
    "formula": "C22H32O3",
  },
  "metadata": {
    "file_name": "/MassBank3/test-data/MSBNK-test-TST00003.txt",
    "version_ref": ""
  },
  "accession": "MSBNK-test-TST00003",
  "contributor": "test",
  "copyright": "Copyright (C) 2019, Leibniz Institut fuer Analytische Wissenschaften - ISAS - e.V., Dortmund, Germany",
  "deprecated": {
    "date": "2019-11-25T00:00:00Z",
    "reason": "Wrong MS measurement assigned"
  },
  "acquisition": {
    "general": null,
    "instrument": "Q-Exactive HF, Thermo Scientific [MS:1002523]",
    "chromatography": null,
    "instrument_type": "LC-ESI-QTOF",
    "mass_spectrometry": [
      {
        "value": "MS2",
        "subtag": "MS_TYPE"
      },
      {
        "value": "NEGATIVE",
        "subtag": "ION_MODE"
      },
      {
        "value": "ESI",
        "subtag": "IONIZATION"
      },
      {
        "value": "HCD",
        "subtag": "FRAGMENTATION_MODE"
      },
      {
        "value": "20.0 eV",
        "subtag": "COLLISION_ENERGY"
      },
      {
        "value": "N/A",
        "subtag": "RESOLUTION"
      }
    ]
  },
  "publication": null,
  "title": "11-HDoHE; LC-ESI-QTOF; MS2; CE: 20.0; R=N/A; [M-H]-",
  "mass_spectrometry": {
    "focused_ion": [
      {
        "value": "343.2279",
        "subtag": "BASE_PEAK"
      },
      {
        "value": "343.2279",
        "subtag": "PRECURSOR_M/Z"
      },
      {
        "value": "[M-H]-",
        "subtag": "PRECURSOR_TYPE"
      }
    ],
    "data_processing": null
  }
}', 1);
