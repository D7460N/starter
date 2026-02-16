
Here is a clean conceptual diagram of the modern browser pipeline.

```
                ┌────────────────────┐
                │         NETWORK        │
                │     (HTTP / HTTPS)     │
                └─────────┬──────────┘
                            │
         ┌───────────────┼───────────────┐
         │                  │                  │
┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼───────┐
│  HTML Parser   │ │   CSS Parser   │ │ JS Engine       │
│  (C++ / Rust)  │ │  (C++ / Rust)  │ │ (V8 / JSC / SM) │
└──────┬──────┘ └───────┬──────┘ └──────┬───────┘
         │                  │                  │
         │                  │                  │
┌──────▼──────┐ ┌──────▼──────┐          │
│      DOM       │ │      CSSOM     │          │
│(Structure Tree)│ │  (Style Rules) │          │
└──────┬──────┘ └───────┬──────┘          │
        │                   │                  │
        └────────┬───────┴───────────────┘
                   │
         ┌───────▼──────┐
         │   Render Tree   │
         │ (DOM + CSSOM)   │
         └───────┬──────┘
                   │
         ┌───────▼──────┐
         │     Layout      │
         │ (Box geometry)  │
         └───────┬──────┘
                   │
         ┌───────▼──────┐
         │      Paint      │
         │ (Draw pixels)   │
         └───────┬──────┘
                   │
         ┌───────▼──────┐
         │   Compositing   │
         │ (GPU layers)    │
         └──────────────┘
```

```rust

  _\ _ _\_ __\_ __\_ 
    \    \    \    \    
\__ _\__ _\__ _\__ _\__ _\
 \ NETWORK \    \    \     
__\_ __\__ _\_ __\ ___\_   /\\           /\\
      .                   /  \\         /  \\
HTTPS.Request            /HTML\\       /DOM \\
    .                   /Parser\\     /Struct\\
   .      /\ \          \ Rust //     \ Tree //
  .      /::\ \     . . .\ C++//. . . .\    //. . .
 .      /::::\ \     .    \  //  /\\    \  //  /\\ .
  .    /::::::\ \     .    \//  /  \\    \//  /  \\ .
   .  /::::::::\ \     .       /CSS \\       /CSSOM\ .
    ./  BROWSER \ \     .     /Parser\\     /Style \\ .
    /(User Agent)\_\     .    \ Rust //     \Rules //  .
    \    (UA)    / /. . . . . .\ C++//. . . .\    //. . . . . .
     \::::::::::/ /        .    \  //  /\\    \  //      .   .
      \::::::::/ /          .    \//  /  \\    \//        . .
       \::::::/ /            .       / JS \\               .
       .\::::/ /              .     /Engine\\             . .
      .  \;;/ /                .    \V8/JSC//            .   .
     .    \/_/                  . . .\ SM //. . . . . . . . . .
    .                                 \  //            .
   .               /\\     /\\     /\\ \// /\\        .
  .               /  \\   /  \\   /  \\   /  \\      .
 . . . . . . . . .\  //. .\  //. .\  //. .\  //. . .
                   \//     \//     \//     \//      
                      \       \       \       \__[ Render Tree (DOM + CSSOM) ]
                       \       \       \__[ Layout (Box geometry) ]
                        \       \__[ Paint (Draw pixels) ]
                         \__[ Compositing (GPU layers) ]





```

---

### Key Clarifications

• HTML parser builds the **DOM**
• CSS parser builds the **CSSOM**
• JS engine runs independently
• JS can modify DOM or styles → which may trigger new layout/paint

---

### Critical Architectural Insight

CSS and layout happen inside the rendering engine.

JS runs in a separate engine.

When JS touches layout or computed styles, the rendering engine may be forced to sync — that’s where performance costs appear.

---

If you want, I can now draw:

1. A “JS framework runtime” layered on top of this
2. Or a side-by-side of native CSS state vs JS state engine

That comparison is where the runtime discussion becomes very clear.

 
