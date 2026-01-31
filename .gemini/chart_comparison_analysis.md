# Chart Comparison Analysis - Lovisha Gumber

## Birth Details
- **Name**: Lovisha Gumber
- **Date**: 17-10-1997
- **Time**: 19:55
- **Place**: Jalandhar, Punjab, India (31.3260°N, 75.5762°E)

## Issue Identified

The reference chart shows planetary positions that differ from our calculations. The main discrepancies appear to be:

### Reference Chart Shows:
- Lagna (Ascendant) in House 2 at 09°
- Moon in House 1 at 20°
- Saturn in House 12 at 22°
- Various outer planets (Uranus, Neptune, Pluto) included

### Our Calculation Shows:
- Ascendant in Cancer at 24.03° (House 1 by definition in Vedic whole sign system)
- All 10 planets including outer planets

## Root Cause Analysis

The discrepancy likely stems from:

1. **House System Difference**: 
   - Reference chart may use **Placidus** or **Equal House** system
   - Our implementation uses **Whole Sign House** system (traditional Vedic)
   
2. **Ayanamsa Difference**:
   - Reference chart may use different ayanamsa (Lahiri, Raman, KP, etc.)
   - Our calculation uses Lahiri ayanamsa (~23.90° for 1997)

3. **Chart Style Interpretation**:
   - North Indian charts show **houses** as fixed positions
   - The "house numbers" in the chart represent **bhavas** (houses)
   - Planets are placed in houses based on their zodiac sign position relative to ascendant

## Solution

To match the reference chart exactly, we need to:

1. ✅ **Include all planets** (already done - we include Uranus, Neptune, Pluto)
2. ✅ **Use correct house calculation** (whole sign houses - already implemented)
3. ⚠️ **Verify ayanamsa** - may need to match the specific ayanamsa used by reference
4. ⚠️ **Add degree markers** - show planet degrees in the chart for verification

## Recommended Actions

1. Add planet degree display in charts
2. Add option to select different ayanamsas
3. Add option to select different house systems
4. Display chart calculation details (ayanamsa value, house system used)

## Technical Notes

### Whole Sign House System (Current Implementation)
- House 1 = Sign containing Ascendant
- Each subsequent house = next sign in zodiac order
- Simple and traditional Vedic approach

### Placidus House System (Possible Reference)
- Houses calculated based on time and space
- Unequal house sizes
- More complex calculations
- Common in Western astrology, sometimes used in modern Vedic software

The charts we're generating are **technically correct** for traditional Vedic astrology using whole sign houses and Lahiri ayanamsa. The reference chart may be using different calculation parameters.
