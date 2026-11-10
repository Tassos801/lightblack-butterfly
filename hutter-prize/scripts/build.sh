#!/bin/bash
# Build fx2-cmix the official way (clang-17, PGO trained on prof_input/input,
# LTO, upx, self-extracting packaging) inside a source tree copy.
#
#   scripts/build.sh <build_dir> [extra -D defines...]
#
# <build_dir> is a copy of the fx2-cmix tree (see scripts/new_build.sh).
# Result:  <build_dir>/run/cmix        = upx'd binary + comp_dict + comp_order + header (what the prize counts)
#          <build_dir>/run/cmix_orig   = upx'd binary alone
#          <build_dir>/build.log, <build_dir>/BUILD_INFO
# Env: SEED (923), UPDATE_LIMIT (3000), NO_PGO=1 (plain -O3, no PGO/LTO), NO_UPX=1.
# Example: scripts/build.sh ~/hp-work/builds/exp1 -DPPMD_MMAP_TO_DISK=0
set -euo pipefail
B=$(realpath "$1"); shift
EXTRA="$*"
SEED=${SEED:-923}; UPDATE_LIMIT=${UPDATE_LIMIT:-3000}
DEFS="-DSEED=$SEED -DUPDATE_LIMIT=$UPDATE_LIMIT $EXTRA"
cd "$B"
exec > >(tee build.log) 2>&1
set -x
rm -rf pgo_data run; mkdir -p pgo_data run
if [ -z "${NO_PGO:-}" ]; then
  make CFLAGS_DEFINES="$DEFS" prof_gen -j
  # PGO training run (50 KB, ~20 s). Runs in its own dir: cmix writes
  # ./progress.log and ./ppm.temp into the cwd.
  T=$(mktemp -d "$B/pgo_run.XXXX")
  ( cd "$T" && "$B/cmix" -c "$B/prof_input/input" ./prof_comp > /dev/null 2>&1 )
  rm -rf "$T"
  llvm-profdata-17 merge -output=pgo_data/default.profdata ./pgo_data/*.profraw
  make CFLAGS_DEFINES="$DEFS" prof_use -j
else
  make CFLAGS_DEFINES="$DEFS" clean cmix -j
fi
[ -n "${NO_UPX:-}" ] || upx-ucl -9 cmix
cp ./cmix run/cmix_orig
cd run
# self-extracting compressor = binary + cmix-compressed dictionary + article order + 12-byte header
./cmix_orig -c "$B/dictionary/english.dic" ./comp_dict > /dev/null 2>&1
./cmix_orig -c "$B/src/readalike_prepr/data/new_article_order" ./comp_order > /dev/null 2>&1
./cmix_orig -h "$(stat -c %s comp_dict)" "$(stat -c %s comp_order)" 0
cat ./cmix_orig ./comp_dict ./comp_order header.dat > ./cmix
chmod +x ./cmix
rm -f progress.log ppm.temp
set +x
{
  echo "defines: $DEFS"
  echo "pgo: $([ -z "${NO_PGO:-}" ] && echo yes || echo no)  upx: $([ -z "${NO_UPX:-}" ] && echo yes || echo no)"
  echo "cmix_orig_bytes: $(stat -c %s cmix_orig)"
  echo "comp_dict_bytes: $(stat -c %s comp_dict)"
  echo "comp_order_bytes: $(stat -c %s comp_order)"
  echo "compressor_total_bytes(S1): $(stat -c %s cmix)"
  echo "cmix_sha1: $(sha1sum cmix | cut -d' ' -f1)"
} | tee "$B/BUILD_INFO"
