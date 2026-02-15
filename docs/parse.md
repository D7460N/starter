
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
```

  _\ _ _\_ __\_ __\_ 
    \    \    \    \    
\__ _\__ _\__ _\__ _\__ _\ 
 \ NETWORK \   .\    \     
__\_ __\__ _\_.__\ ___\__ _\
             .
            .__HTTP(S) request
  _ _ _ _ _._ _ _
 /\       .       \
 \ \               \
  \ \               \
   \ \ User Agent    \
    \ \_ _ _ _ _ _ _ _\
     \/_ _ _ _ _ _ _ _/




            /      __       __[ HTML Parser (C++ / Rust)
           /      /\ \     / __[ CSS Parser (C++ / Rust)
          /      /::\ \   / / __[ JS Engine (V8 / JSC / SM)
         /      /::::\ \  \/ /
        /      /::::::\ \  \/
       /----> /::User::\_\
      /       \::Agent:/ /
     /         \::::::/ /
    /           \::::/ /
                 \::/ /
                  \/_/

```
                           _____________
                          /            /|
                         /  NETWORK   / |
                        /____________/  |
                        |            |  |
                        |  HTTP(S)   |  |
                        |____________|  /
                        |____________| /

                 _____________          _____________          _____________
                /            /|        /            /|        /            /|
               / HTML PARSE / |       /  CSS PARSE / |       /   JS ENGINE/ |
              /____________/  |      /____________/  |      /____________/  |
              |            |  |      |            |  |      |            |  |
              |  tokenizer |  |      | tokenizer  |  |      |  parse+run |  |
              |____________|  /      |____________|  /      |____________|  /
              |____________| /       |____________| /       |____________| /

                 _____________          _____________
                /            /|        /            /|
               /     DOM    / |       /    CSSOM   / |
              /____________/  |      /____________/  |
              |            |  |      |            |  |
              | structure  |  |      | style rules|  |
              |____________|  /      |____________|  /
              |____________| /       |____________| /

                           _____________
                          /            /|
                         / RENDER TREE/ |
                        /____________/  |
                        |            |  |
                        | DOM+CSSOM  |  |
                        |____________|  /
                        |____________| /

                           _____________
                          /            /|
                         /   LAYOUT   / |
                        /____________/  |
                        |            |  |
                        | box geom   |  |
                        |____________|  /
                        |____________| /

                           _____________
                          /            /|
                         /    PAINT   / |
                        /____________/  |
                        |            |  |
                        | pixels     |  |
                        |____________|  /
                        |____________| /

                           _____________
                          /            /|
                         / COMPOSITING/ |
                        /____________/  |
                        |            |  |
                        | GPU layers |  |
                        |____________|  /
                        |____________| /
```





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

 
