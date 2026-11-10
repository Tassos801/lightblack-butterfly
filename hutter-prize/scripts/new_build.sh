#!/bin/bash
# Create a fresh, patched copy of the fx2-cmix source for an experiment.
#   scripts/new_build.sh <name>      -> /home/user/hp-work/builds/<name>
# Applies patches/bench-portability.patch (mmap MAP_FIXED fix + PPMD_* macros;
# does not change the compressed stream with default defines).
set -euo pipefail
HERE=$(dirname "$(realpath "$0")")
SRC=${FX2_SRC:-/home/user/kaitz/fx2-cmix}
DST=${HP_WORK:-/home/user/hp-work}/builds/$1
[ -e "$DST" ] && { echo "$DST exists" >&2; exit 1; }
mkdir -p "$DST"
(cd "$SRC" && tar cf - --exclude=.git .) | (cd "$DST" && tar xf -)
(cd "$DST" && patch -p0 < "$HERE/../patches/bench-portability.patch")
echo "$DST"
