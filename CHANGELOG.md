# Changelog

## [2025.11.0](https://github.com/MassBank/MassBank3/compare/v2025.10.6...v2025.11.0) (2025-11-12)


### Features

* added an status table in Postgres & show a notification at homepage in case of a database update or errors in backend services (close [#131](https://github.com/MassBank/MassBank3/issues/131)) ([c896aed](https://github.com/MassBank/MassBank3/commit/c896aedec3939e4aaa8fbc719dfe57af8ea7d7ba))
* display structure from SMILES in peak annotation if available ([f416950](https://github.com/MassBank/MassBank3/commit/f416950dfb32628a785c9c81e01ad3b8dea4e2e3))


### Bug Fixes

* crash in frontend when entering a non-existing accession ([db351b6](https://github.com/MassBank/MassBank3/commit/db351b6862d919b89632e7985d3138871fd309b3))
* crash in mb3server when Postgres database is down (close [#91](https://github.com/MassBank/MassBank3/issues/91)) & adjustments in frontend ([fad5a00](https://github.com/MassBank/MassBank3/commit/fad5a0010130771701bb51c0ef4f0c1227dc0f31))

## [2025.10.6](https://github.com/MassBank/MassBank3/compare/v2025.10.4...v2025.10.6) (2025-11-03)


### Features

* allowed partial search for InChiKey starting at the beginning ([ca43b49](https://github.com/MassBank/MassBank3/commit/ca43b49a1f60f2d3a98f0cc47a770d2ea0d70fe7))


### Miscellaneous Chores

* release v2025.10.6 ([0a76ea1](https://github.com/MassBank/MassBank3/commit/0a76ea1e1675db1a6f0c5a761ec7e9e1f674108c))

## [2025.10.4](https://github.com/MassBank/MassBank3/compare/v2025.10.3...v2025.10.4) (2025-10-29)


### Miscellaneous Chores

* release v2025.10.4 ([fdf1713](https://github.com/MassBank/MassBank3/commit/fdf17138b7297abf946d0dbc3cf1b1ea0f4f95be))

## [2025.10.2](https://github.com/MassBank/MassBank3/compare/v2025.8.12...v2025.10.2) (2025-10-29)


### Features

* allow download of a single MassBank record from record page (close [#118](https://github.com/MassBank/MassBank3/issues/118)) ([ce46278](https://github.com/MassBank/MassBank3/commit/ce462785f8b640763541cba087619bba7dc2b0d3))
* enable downloads in Massbank record file format (closes [#119](https://github.com/MassBank/MassBank3/issues/119)) & enable view of raw record data in new tab from single record page (close [#116](https://github.com/MassBank/MassBank3/issues/116)) ([9b4f7af](https://github.com/MassBank/MassBank3/commit/9b4f7afe7f7b2a1d8e39a570a148c718d271cd63))
* new copy button in case of raw record view in AccessionView ([8ce141f](https://github.com/MassBank/MassBank3/commit/8ce141f45093d639f6e74eb8638d2b8fe6406af4))
* show service versions on About page as well ([3eb6b96](https://github.com/MassBank/MassBank3/commit/3eb6b966301c2b53cea653a7f066a9a8e1b66f89))


### Bug Fixes

* added a missing dependency in useMemo in RecordViewHeader.tsx ([8505afd](https://github.com/MassBank/MassBank3/commit/8505afdfbc175317a978e7aab8c43a8e3726bebf))
* avoid crash in recordViewHeader in case of no ChemOnt classifications ([5187794](https://github.com/MassBank/MassBank3/commit/5187794fde77a599cf541421ceeb31061c5f0680))
* incorrect rendering of extended SMILES in StructureView (close [#117](https://github.com/MassBank/MassBank3/issues/117)) & force breaks of long SMILES and InChIs in RecordViewHeader ([f209ee9](https://github.com/MassBank/MassBank3/commit/f209ee94dab4dcd7d25b63cbe3adf253557ba08e))
* increase height of title in RecordViewHeader and align it central ([8f22f32](https://github.com/MassBank/MassBank3/commit/8f22f327179e731df18109e2117afc46d8b91c12))


### Miscellaneous Chores

* release v2025.10.2 ([1e5e9c3](https://github.com/MassBank/MassBank3/commit/1e5e9c3a9fd6f03d91f45c2112b10ea7b48f55dd))

## [2025.8.12](https://github.com/MassBank/MassBank3/compare/v2025.8.11...v2025.8.12) (2025-08-28)


### Miscellaneous Chores

* release v2025.8.12 ([40a5fd0](https://github.com/MassBank/MassBank3/commit/40a5fd087a84fa89cd620d405e071d6c52542a95))

## [2025.8.9](https://github.com/MassBank/MassBank3/compare/v2025.8.8...v2025.8.9) (2025-08-28)


### Bug Fixes

* added KAKENHI and MSSJ to list of supporters ([d12681c](https://github.com/MassBank/MassBank3/commit/d12681c58a5861af5cc372e4e0520e37abb3260a))
* do not use same version file as release-please; use mb_version.txt instead ([2a98a40](https://github.com/MassBank/MassBank3/commit/2a98a40b8d4defbcfb498d1dd6d4eae70fe11e3d))


### Miscellaneous Chores

* release v2025.8.9 ([a3c1321](https://github.com/MassBank/MassBank3/commit/a3c1321d096859f0bb5986f68a457646162a01ee))

## [2025.8.7](https://github.com/MassBank/MassBank3/compare/v2025.8.6...v2025.8.7) (2025-08-25)


### Bug Fixes

* do not import deprecated MassBank records into Postgres database; close [#108](https://github.com/MassBank/MassBank3/issues/108) ([0724a23](https://github.com/MassBank/MassBank3/commit/0724a23cb19f56513119c655fc5a9c95f30deb45))

## [2025.8.4](https://github.com/MassBank/MassBank3/compare/v2025.8.3...v2025.8.4) (2025-08-25)


### Miscellaneous Chores

* release 2025.8.4 ([2bc01f8](https://github.com/MassBank/MassBank3/commit/2bc01f884930cd5c45da0c29157951a891e2a9f3))

## [2025.8.3](https://github.com/MassBank/MassBank3/compare/v2025.8.2...v2025.8.3) (2025-08-21)


### Bug Fixes

* use correct DOI (Zenodo) ([1bf309f](https://github.com/MassBank/MassBank3/commit/1bf309f39808e5b3c84c11bdf35dd52a87439783))


### Miscellaneous Chores

* release 2025.8.3 ([d279a7e](https://github.com/MassBank/MassBank3/commit/d279a7e48c71e68da28f31247823bc9ee61dfa65))

## [2025.8.2](https://github.com/MassBank/MassBank3/compare/v2025.8.1...v2025.8.2) (2025-08-21)


### Bug Fixes

* add missing mkdir  command in README ([00d889d](https://github.com/MassBank/MassBank3/commit/00d889d31e448e24a8890e3d5635fd5844d04d56))


### Miscellaneous Chores

* release v2025.8.2 ([7737ba6](https://github.com/MassBank/MassBank3/commit/7737ba6d4070bece7ea33632c47049491fca09c7))

## [2025.8.1](https://github.com/MassBank/MassBank3/compare/v2025.8.0...v2025.8.1) (2025-08-19)


### Features

* added tooltip to the Chart component describing the zoom and min rel intensity ([f46de46](https://github.com/MassBank/MassBank3/commit/f46de46e318f2bb2305a4575c10177c507bd4973))


### Bug Fixes

* pull before merging dev into main branch ([f659c69](https://github.com/MassBank/MassBank3/commit/f659c696495df6b87a58c4b32dfd5ea194263048))


### Miscellaneous Chores

* release v2025.8.1 ([a41124c](https://github.com/MassBank/MassBank3/commit/a41124cfee5ece233803631243395b58aeb7f23d))
