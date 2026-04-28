# Minimal Console Visual Grammar

## Purpose

Provide a deterministic, no-fluff console visualization standard for:

-   Linear execution flow
-   Decision boundaries
-   Failure boundaries
-   Clear break indication

This system uses:

-   Plain text for linear flow
-   Boxes only for structural decisions and failures
-   Colored arrows for execution state
-   Red only for break conditions

No decorative output. High signal only.

------------------------------------------------------------------------

# Linear Success Path (No Boxes)

Green arrow indicates continued execution.

``` js
const okArrow = "color:#4caf50;font-weight:bold;";
const normal = "color:#ccc;";

console.log("%c→%c fetchData() ✓", okArrow, normal);
console.log("%c→%c normalize() ✓", okArrow, normal);
console.log("%c→%c render() ✓", okArrow, normal);
```

Rendered:

→ fetchData() ✓\
→ normalize() ✓\
→ render() ✓

------------------------------------------------------------------------

# Decision Boundary (Box Justified)

Boxes represent structural forks only.

``` js
const box = "color:#ffffff;font-weight:bold;";

console.log("%c+-----------------------------+", box);
console.log("%c|      isFirstVisit()?        |", box);
console.log("%c+-----------------------------+", box);
```

Rendered:

+-----------------------------+
|      isFirstVisit()?        |
+-----------------------------+

------------------------------------------------------------------------

# Branch Continuation

``` js
console.log("%c→%c NO", okArrow, normal);
console.log("%c→%c loadLocalConfig() ✓", okArrow, normal);
```

------------------------------------------------------------------------

# Failure Boundary (Red Arrow + Failure Box)

Red arrow marks break location. No arrow printed after failure.

``` js
const fail = "color:#ff4d4f;font-weight:bold;";

console.log("%c→%c fetchData() ✓", okArrow, normal);
console.log("%c→%c normalize() ✓", okArrow, normal);

console.log("%c→%c render() ✗", fail, fail);

console.log("%c+-----------------------------+", fail);
console.log("%c|           FAILED            |", fail);
console.log("%c+-----------------------------+", fail);
```

Rendered:

→ fetchData() ✓\
→ normalize() ✓\
→ render() ✗

+-----------------------------+
|           FAILED            |
+-----------------------------+

------------------------------------------------------------------------

# Failure Details Section

After the failure boundary, provide structured detail:

``` js
console.log("\nDETAILS");
console.log("Function: render()");
console.log("Reason: Cannot read property 'map' of undefined");
console.log("File: render.js");
console.log("Line: 42");
```

------------------------------------------------------------------------

# Visual Grammar Rules

-   Green arrow → execution continues
-   Red arrow → execution stops
-   Box → decision or failure boundary only
-   No box for linear success
-   No arrow after failure
-   Keep layout narrow and deterministic
-   Use consistent box width
-   Never hardcode paths
-   Always reflect actual runtime state

------------------------------------------------------------------------

# Intent

This system provides:

-   At-a-glance path confirmation
-   Immediate break visibility
-   Decision clarity
-   CI-safe logging
-   Zero dependency architecture validation
