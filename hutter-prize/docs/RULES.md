# Hutter Prize (enwik9) — rules, record, and what we must beat

Researched 2026-11-10 from primary sources. Every claim carries its source.
Anything not confirmed by a primary source is marked **UNVERIFIED**.

Source keys used below:

| Key | URL | Notes |
| --- | --- | --- |
| [PRIZE] | http://prize.hutter1.net/ | Main page. HTTP `Last-Modified: 30 Sep 2026`. |
| [RULES] | http://prize.hutter1.net/hrules.htm | Detailed rules. HTTP `Last-Modified: 09 Oct 2024` (not touched since the fx2-cmix award). |
| [FAQ] | http://prize.hutter1.net/hfaq.htm | FAQ. |
| [LTCB] | https://mattmahoney.net/dc/text.html | Large Text Compression Benchmark, "Last update: Oct. 14, 2026". |
| [GROUP] | https://groups.google.com/g/Hutter-Prize | Official discussion list; committee members (Mahoney, Bowery) post here. |
| [HPJA] | https://github.com/jabowery/HutterPrizeJudgingAssistant/blob/main/ENTRANT_INSTRUCTIONS.md | Judging-assistant entrant contract (alpha tool, not a rule). |
| [FX2] | /home/user/kaitz/fx2-cmix/README.md | Local clone of the 2024 winner's README. |

encode.su (https://encode.su/threads/4539-Hutter-prize-backlog) could **not** be read: it returns
HTTP 403 behind a Cloudflare challenge. Nothing below relies on it.

---

## 0. Headline: fx2-cmix is no longer the record

**fx2-cmix (110,793,128) has been superseded three times in 2026, and at least four further
submissions are queued ahead of us.**

- Officially awarded record today: **L = 100,424,672 bytes**, `fx2-cmix-transformer`
  ("fx2-cmix-T") by **Vladimir Ivanov**, submitted 24 Jul 2026, awarded 30 Sep 2026
  [PRIZE "Current and Previous Records"; LTCB entry `.0969 fx2-cmix-transformer`].
  Source: https://github.com/astOwOlfo/fx2-cmix-transformer-v1/ —
  write-up: https://github.com/astOwOlfo/fx2-cmix-transformer-v1/blob/main/writeup.md
- Best **pending** submission: **cmix-neif-2.0, S = 93,388,956 bytes**, Marcus Wölk, submitted
  30 Oct 2026, opened for public comment 31 Oct 2026
  [GROUP https://groups.google.com/g/Hutter-Prize/c/BihAbnYZn08].
  Source: https://github.com/marwoelk/cmix-neif-2.0 , binaries https://marwoelk.de/cmix-neif-2.0/
- Because entries are judged in submission order (section 4), **the number we realistically have
  to beat is 1% under cmix-neif-2.0, i.e. S ≤ 92,455,066 bytes**, not 1% under the awarded record.

---

## 1. Size metric, record, threshold

### What is counted

- Standard form: publish a compressor `comp9.exe` that, given `enwik9`, outputs a self-extracting
  `archive9.exe`; run with no input, the archive reproduces the 10^9-byte file exactly.
  **S := length(comp9.exe or its zip) + length(archive9.exe)** [RULES "Rules"].
  The main page states the same as S := S1 + S2 (compressor + archive) [PRIZE "The Task"].
- So the decompressor is counted inside the archive, and the compressor is counted *in addition*.
  Any model weights/dictionary shipped in both binaries are therefore paid for twice (the zmix
  write-up quoted on [LTCB `.0960 zmix`] says exactly this; rationale in [FAQ #addcomp]).
- Relaxation (separate decompressor): compressor `comp9a.exe` -> `archive9.bhm`, decompressor
  `decomp9.exe`. Then **S := length(comp9a.exe/zip) + 2×length(decomp9.exe/zip) +
  length(archive9.bhm)**; the 2× drops to 1× if comp9a.exe = decomp9.exe [RULES "Relaxations"].
- A zip of source code + makefile may be submitted in place of each executable; C++, Python and
  Assembler are accepted, other languages at the committee's discretion [RULES "Relaxations"].
- **Command-line options count**: "If command-line options for execution or compilation are
  necessary, their length is added to S" [RULES "Relaxations"]. Recent entries are scored with a
  19-byte `comp9.args` added (e.g. cmix-neif 1.0 "4,000,689+19" on [LTCB `.0919`]).
- Executable packers are fine: the FAQ recommends UPX "because the result is still an
  executable", and says external data such as dictionaries should be embedded in the decompressor
  [FAQ #self].
- enwik9 is exactly 10^9 bytes [FAQ #1GB]. SHA-256 quoted by entrants:
  `159b85351e5f76e60cbe32e04c677847a9ecba3adc79addab6f4c6c7aa3744bc`
  [GROUP https://groups.google.com/g/Hutter-Prize/c/K_GFXS4Abac] — entrant-reported, verify locally.

### Current record L

- **L = 100'424'672** is printed in the task statement: "S:=S1+S2 < L := 100'424'672"
  [PRIZE "The Task"]. Breakdown: archive9 96,996,198 + compressor 3,428,474 [LTCB `.0969`].

### Minimum improvement

- "Minimum award is 1% of Z" and "Minimum claim is 5'000€ (1% improvement)"
  [RULES "Award"; PRIZE "The Task"]. Missing 1% leaves L unchanged and the entry is ignored
  [RULES "More Information"].
- Against the awarded record: 0.99 × 100,424,672 = 99,420,425.28. The prize table's "You?" row
  prints the target as **"<99'420'425"** [PRIZE]. Use **S ≤ 99,420,424** to be safe against the
  strict "<" as printed.
- This number is already obsolete in practice — see section 4.

---

## 2. Resource limits

| Limit | Rule | Source |
| --- | --- | --- |
| Time | "Each program must run in less than **70'000/T hours** ... where T is the machine's **Geekbench5** score." Applies to compressor and decompressor separately ("Resource restrictions for all executables are the same"). | [RULES "Rules", "Relaxations"] |
| Cores | Main page: "Must run in **≲50 hours using a single CPU core**". Committee practice uses the **single-core** GB5 score for T (e.g. "70000/1648 = 42.475 hours"). | [PRIZE "The Task"]; [LTCB `.1091 cmix-lex`]; [FAQ #cpucore] |
| RAM | "at most **10GB RAM**". Judging tool: 16 GiB machine, no swap, **peak RSS ≤ 10 GiB**. | [RULES]; [HPJA §9] |
| Disk | "**100GB HDD** for temporary files". | [RULES] |
| GPU | "**No GPU usage**" at compress/decompress time. | [RULES]; [FAQ #cpucore] |
| OS / arch | "Windows or Linux (x86 32bit or 64bit) executables", runnable "without additional installations"; standard libraries allowed. | [RULES] |
| External data | "Programs must run without input from other sources (files, network, dictionaries, etc.)". Decompressors "(secretly) receiving any kind of 'outside' information are forbidden". | [RULES]; [PRIZE "Disclaimer"] |

Notes and inconsistencies between the official pages:

- **Time formula is stated three ways.** [RULES] says 70'000/T; [PRIZE] says ≲50 h single core;
  [FAQ #ram1gb, #cpucore] still says "100 hours" and "500'000/T" (stale 2020 text — the 100 h /
  50'000/T wording survives only inside an HTML comment in hrules.htm). Every 2024-2026 entrant
  and the committee use **70'000/T with T = GB5 single-core** [FX2 "Time"; LTCB `.1091`; GROUP
  threads]. Treat 70'000/T as binding.
- **Listed test machines** ("as of 2021, may change without notice"): Lenovo 82HT i7-1165G7
  (Windows), T≈1427 single / 4667 4-core; AMD Ryzen 7 3.6GHz (Linux), T=1310 single / 8228 8-core
  [RULES]. That gives 49.1 h and 53.4 h respectively.
- Mahoney's actual Intel box reports GB5 = 1499 and only 11.8 GB visible under WSL2, which makes
  mmap-to-disk entries run very slowly there (fx2-cmix-transformer: 8 days; cmix-neif 1.0:
  82.87 h) [LTCB note 106, `.0969`, `.0919`]. These entries were nevertheless awarded/kept
  pending on the strength of AMD / cloud runs. How the committee reconciles a slow Intel run with
  the limit is **UNVERIFIED** — no written policy found.
- Recent entries are validated on well-specified cloud instances (GCP `c2d-highcpu-8` EPYC 7B13,
  T≈1284-1306 -> limit 53.6-54.5 h; AWS EPYC 7R13, T=1292 -> 54.18 h)
  [GROUP c/BihAbnYZn08, c/fBvEDyWzGuo].
- **Offline pre-training on GPUs is accepted** as long as the weights are inside the counted
  binaries and the run itself is CPU-only: the awarded record trained a 6M-parameter transformer
  on 8 RTX 5090s for 26 h [LTCB `.0969`], and the FAQ now endorses this explicitly ("Pre-trained
  medium-sized Transformers are fast enough by externalizing the high compute demand")
  [FAQ #largenn, #getsource].
- Entries need not be general purpose; they may fail on any input other than enwik9
  [RULES "More Information"].
- Cross-vendor determinism matters: fx2-cmix-transformer segfaulted on Intel at first and needs
  `-mrecip=none` so AMD and Intel produce identical floats
  [LTCB `.0969`; https://github.com/astOwOlfo/fx2-cmix-transformer-v1/blob/main/README.md].

---

## 3. Source, licence, documentation, comment period, award, submission

**Source and licence**
- "Documented source code must be made publicly available under some OSI-approved license before
  the prize money will paid out" [RULES "More Information"]. Any OSI licence is acceptable;
  stated preference Unlicense > MIT > Apache > Mozilla > GNU [FAQ #license].
- Programs and data must be freely downloadable on the Internet [RULES "More Information"].
- A document explaining the algorithmic ideas and inner workings is required, plus
  usage/compilation instructions [RULES "Participation"].
- Prior winners' code may be "used/adapted/improved with attribution" [FAQ #getsource].
- Build hygiene (committee statement, Aug 2026): build procedures must be working scripts; no
  manual steps; root-requiring steps (`apt install`) must be isolated from the build script
  [GROUP https://groups.google.com/g/Hutter-Prize/c/7Ed6oghHyu0].
- The Judging Assistant contract (`entry.env`, `install.sh`, offline `build.sh`, `comp9.args`,
  Ubuntu 20.04/22.04/24.04 Docker userspace, network disabled at run time) is "an alpha test of a
  tool", not a rule, but compliant entries may be judged sooner
  [HPJA; GROUP https://groups.google.com/g/Hutter-Prize/c/3fAloBeTEeI].

**Public comment / waiting period**
- "The contribution is subject to public comments for a period of at least 30 days before the
  prize is awarded" [RULES "Award"]. Comments go to the Google group or the committee.
- "If an author breaks his own record within 30 days, the older submission is regarded as
  withdrawn" [RULES "More Information"].

**Award**
- Award = Z × (L − S) / L, Z = 500'000€; after an award L := S and Z is not reduced
  [RULES "Award"]. Smallest claimable prize 5'000€ [PRIZE "Disclaimer"].
- Multiple authors must agree a split up front. Committee members are ineligible for money.
  Payment is not legally enforceable; Marcus Hutter makes the final decision; rules may change
  without notice [RULES "More Information"].
- Total paid so far: 85'485€ [PRIZE header].

**How to submit**
- Email mattmahoneyfl@gmail.com, jabowery@gmail.com and marcus.hutter@gmx.net with a numbered
  list: (1) direct link to archive9.exe (or decomp9.exe + archive9.bhm); (2) a single-line run
  instruction ("long/complicated instructions are inadmissable"); (3) program names, version,
  options; (4) sizes; (5) approximate (de)compression time and peak RAM/disk; (6) test machine
  incl. Geekbench5 score; (7) download links for executables/zipped source, documented source
  under an OSI licence, the ideas document, and build instructions [RULES "Participation"].
- There is no deadline [PRIZE; FAQ #ongoing].

---

## 4. Queue: awarded record vs. what is pending

"Contributions are dealt with in the order of their submission" [RULES "Award"]. Committee member
James Bowery confirmed on 24 Aug 2026 that an entry is measured against "the record after
[earlier pending entries are] decided" — "the timestamp of submission for judging determines the
benchmark it must beat by 1%"
[GROUP https://groups.google.com/g/Hutter-Prize/c/R7vhqMl6AjY].

Submissions after the awarded record, in order (S = compressor + archive [+ args]):

| Submitted | Entry | Author | S (bytes) | vs. previous eligible | Status | Source |
| --- | --- | --- | --- | --- | --- | --- |
| 24 Jul 2026 | fx2-cmix-transformer | V. Ivanov | 100,424,672 | — | **Awarded 30 Sep 2026 (current L)** | [PRIZE], [LTCB `.0969`] |
| 14 Sep 2026 | zmix 1.0 | James Byrne | 99,312,424 | −1.108% | Pending, "still undergoing testing" | [LTCB `.0960`] |
| 27 Sep 2026 | cmix-lex-transformer lexth11c | Neel Patel | 99,313,750 | (−1.106% vs L; worse than zmix) | Pending; "If zmix fails then lexth11c might be eligible" | [LTCB `.0958`], [GROUP c/fBvEDyWzGuo] |
| 5 Oct 2026 | cmix-neif 1.0 | Marcus Wölk | 95,914,051 | −3.42% vs zmix | Pending, open for comment | [LTCB `.0919`], [GROUP c/fBvEDyWzGuo] |
| 23 Oct 2026 | cmix-neif-beehive | Vladimir Malinovskii | 94,705,591 | −1.26% | Pending; Bowery (2 Nov): "passes all criteria in my judgement" | [GROUP c/fBvEDyWzGuo, c/EpcZeDXl6rg] |
| 27 Oct 2026 | cmix-wolf P14 | Philipp Müller | 94,677,221 | −0.03% | "eligible only if cmix-neif-beehive fails" | [GROUP c/K_GFXS4Abac] |
| 30 Oct 2026 | **cmix-neif-2.0** | Marcus Wölk | **93,388,956** | −1.39% vs beehive | Opened for comment 31 Oct; "no eligible submissions since cmix-neif beehive" | [GROUP c/BihAbnYZn08] |

(GROUP thread URLs are `https://groups.google.com/g/Hutter-Prize/c/<id>`.)

- Sizes for the Oct 23-30 entries are **entrant-claimed**; Mahoney is travelling until 13 Nov 2026
  and has not tested them or updated LTCB [GROUP c/fBvEDyWzGuo]. None is awarded.
  Whether each will pass is **UNVERIFIED**.
- Not prize-eligible but shows where the frontier is: `ex-girlfriend 1.0` archive 91,778,237 +
  compressor 3,995,122 = 95,773,359 ("not eligible") [LTCB `.0917`]; `cmix-views 1.0` archive
  90,515,901 but 14.0 GiB RAM, so over the 10 GB limit — LTCB entry only
  [GROUP https://groups.google.com/g/Hutter-Prize/c/XEofV4U3Pns].
- Latest group post is 9 Nov 2026 (a non-entry, rejected); no submission newer than
  cmix-neif-2.0 is visible on [GROUP] page 1 as of 10 Nov 2026. Unannounced submissions in the
  committee's inbox cannot be ruled out (**UNVERIFIED**).
- 1%-under targets by scenario: after zmix 98,319,299; after cmix-neif 1.0 94,954,910; after
  beehive 93,758,535; **after cmix-neif-2.0 92,455,066**.

---

## 5. History of winners

enwik9 contest (500'000€), from [PRIZE "Current and Previous Records"]:

| # | Author | Date | Program | Total size S | Improvement | Award | Source code |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 11 | Vladimir Ivanov | 24 Jul 2026 | fx2-cmix-T | 100,424,672 | 7.46% | 37'300€ | https://github.com/astOwOlfo/fx2-cmix-transformer-v1/ |
| 10 | David Freelan | 19 Jul 2026 | cmix-obias | 108,521,870 | 1.05% | 5'240€ | https://huggingface.co/dfreelan/cmix-obias |
| 9 | Ibrahim Marcouch & Kaido Orav | 26 Jun 2026 | cmix-lex | 109,671,639 | 1.01% | 5'050€ | https://github.com/blahem/cmix-lex |
| 8 | Kaido Orav & Byron Knoll | 3 Sep 2024 | fx2-cmix | 110,793,128 | 1.59% | 7'950€ | https://github.com/kaitz/fx2-cmix (local clone [FX2]) |
| 7 | Kaido Orav | 2 Feb 2024 | fx-cmix | 112,578,322 | 1.38% | 6'911€ | https://github.com/kaitz/fx-cmix |
| 6 | Saurabh Kumar | 16 Jul 2023 | fast cmix | 114,156,155 | 1.04% | 5'187€ | https://github.com/saurabhk/fast-cmix/ |
| 5 | Artemiy Margaritov | 31 May 2021 | starlit | 115,352,938 | 1.1% | 9'000€ | https://github.com/amargaritov/starlit/ |
| — | Alexander Rhatushnyak | 4 Jul 2019 | phda9v1.8 | 116,673,681 | baseline | pre-prize | not released [FAQ #getsource] |

- Dates are submission dates; awards 9-11 were all made on 30 Sep 2026 [LTCB history, 30 Sep 2026].
- fx2-cmix breakdown: compressor 441,463 + archive 110,351,665 = 110,793,128; awarded 8 Oct 2024;
  65 h decompression at GB5 = 1026 (limit 68.2 h), peak RSS 9,523,660 KiB, ~21 GB disk [FX2].
- Discrepancy: the table prints 9'000€ for starlit, the FAQ says the award "was €8260"
  [PRIZE vs FAQ #ddisc]. Unresolved.
- Discrepancy: Mahoney's 31 Aug 2026 backlog post gives cmix-obias as 108,492,825 and cmix-lex as
  "110,793,198" (the latter evidently a typo); the prize table values above are taken as
  authoritative [GROUP https://groups.google.com/g/Hutter-Prize/c/I45YlVtjJZ8].

enwik8 contest (50'000€, closed), all Alexander Rhatushnyak [PRIZE]:
paq8hp5 17,073,018 (25 Sep 2006, 3'416€); paq8hp12 16,481,655 (14 May 2007, 1'732€);
decomp8 15,949,688 (23 May 2009, 1'614€); phda9 15,284,944 (4 Nov 2017, 2'085€).
Baseline: paq8f 18,324,887 (Matt Mahoney, 24 Mar 2006).

---

## 6. What this means for us

**Byte target**

- Formal minimum against the awarded record: **S ≤ 99,420,424**.
- Realistic target, assuming the pending chain is awarded in order: **S ≤ 92,455,066**
  (1% under cmix-neif-2.0's 93,388,956). Anything between those two numbers would be measured
  against an earlier-timestamped pending entry and rejected.
- S = compressor binary + self-extracting archive + bytes of any command-line arguments. With a
  ~4.0 MB compressor (the current norm, mostly quantised transformer weights), the archive itself
  must be about **≤ 88.4 MB**.
- At that level the payout is ~5'000€ per 1%: Z×(L−S)/L with L = 93,388,956 is about 1€ per
  187 bytes.
- The target is moving: three eligible steps landed in October 2026 alone. Re-check [GROUP] and
  [LTCB] before any submission; expect LTCB to update after 13 Nov 2026.

**Compute budget**

- Time: 70'000 / T hours, T = Geekbench 5 single-core score of the test machine, single core, for
  compression and for decompression separately. On the machines actually used for judging
  (T ≈ 1284-1310) that is **≈ 53.4-54.5 h**; on the listed Intel machine (T ≈ 1427) **≈ 49 h**.
  Plan for **≤ ~48 h at T ≈ 1300** to keep margin; the leading entries sit at 49-52 h.
- RAM: **peak RSS ≤ 10 GiB** on a 16 GiB no-swap machine. Current leaders use ~9.75 GiB.
- Disk: ≤ 100 GB temp. Leaders use 13-21 GB, mostly a PPM model mmap'd to disk to stay under the
  RAM cap [FX2; GROUP c/BihAbnYZn08].
- No GPU, no network, no external files at run time; Linux x86-64 static-ish binary. Offline
  GPU training is allowed, but the weights are counted twice (compressor + archive).

**Practical consequences**

- The local fx2-cmix clone is four record-generations behind (110.8 MB vs 93.4 MB pending). The
  relevant baselines to start from are cmix-neif-2.0 (https://github.com/marwoelk/cmix-neif-2.0),
  cmix-neif-beehive (https://github.com/galqiwi/cmix-neif-beehive, GPL-3.0) and
  fx2-cmix-transformer.
- Derivative entries inherit the upstream licence (the cmix-neif line is GPL-3.0 per
  [GROUP c/K_GFXS4Abac]); attribution is required.
- Ship a working non-interactive build script and, ideally, an HPJA-compliant entry directory;
  give a single-line run instruction and a Geekbench 5 single-core score for the test machine.
