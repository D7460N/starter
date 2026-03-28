# D7460N PROJECT


## TODAY

TYPICAL FRAMEWORK ARCHITECTURE [ UX PERSPECTIVE ]

- Presentation Layer UI logic coupled together with data layer business logic


```


   .               /\\     /\\     /\\ \// /\\        .
  .               /  \\   /  \\   /  \\   /  \\      .
 . . . . . . . . .\  //. .\  //. .\  //. .\  // . . .
                   \//     \//     \//     \//
                    \       \       \       \__[ Render Tree (DOM + CSSOM) ]
                     \       \       \__[ Layout (Box geometry) ]
                      \       \__[ Paint (Draw pixels) ]
                       \__[ Compositing (GPU layers) ]




            (         (
             \         \
              )         )
             /         /

╭ ╮
╯ ╰


┌     ┐
  ISP
└     ┘


 ├──────

┴


```



```
            ////////////////////// FRONT END ////////////////////          ///// BACK END /////
           /                                                   /          /                  /
          /_      __________________________________________________/          /_____ _  _ _  _ __/
         /\ \    /\                                                 /\                 .\
        /::\ \  /  \                                                  \       /::\  Python       .  \
       /::::\ \/    \                                                  \     /::::\  DBs        .
_ _ _ /::::::\ \     \                                                  \    \___/::::::\           .
\    /: User::\_\     \ _________________________________________________\   /::::::::\_______  . _     _\
 \   \:Agent::/ /     /                                                 /     \::::::::/ . . .  .         /
  \   \::::::/ /     /                                                 /       \::::::/          .
   \   \::::/ /     /                                                 /         \::::/            .     /
    \   \::/ /     /                                                 /           \::/              .
         \/_/     /_________________________________________________/             \/     


```


```

    // Built-in "truthful" loading state
   // Upgrade/security path NOT controlled by third party dependencies
  // Custom (vanilla) changes DON'T break upgrade/security path
 // Flexible, unopinionated, user-driven (front to back) design and development

                    // FRONT-END - - - - - - - - - - - - - - - - - - - - //
                   /                                                     /
                  // FFE         // FBE         // Framework(s)         /
                 // Micro-FE    /              // CMS(s)               /
                /____          /____          /_______________________/
               /\    \   AIR  /\    \   AIR  /\          \            \
              /::\HTML\ GAP  /::\REST\ GAP  /::\  Build   \  Data      \
             /::::\CSS \    /::::\JSON\    /::::\  Compile \  Logic     \
      _ _ _ /::::::\JS  \_ /::::::\XML \_ /::::::\  Serve   \            \
     /\    /: User :\____\/: API ::\____\/::::::::\__________\____________\
    /  \   \: Agent:/    /\::::::::/    /\::::::::/          /            /
        \   \::::::/ UI /  \::::::/    /  \::::::/  Angular / Typescript /
         \   \::::/ UX / \  \::::/    / \  \::::/  Vue     / JavaScript /
          \   \::/ DX /   \  \::/    /   \  \::/  React   /            /
           \   \/____/ \   \  \/____/ \   \  \/__________/____________/ \
            \_ _ _ _ _ _\   \_ _ _ _ _ \   \_ _ _ _ _ _ _ _ _ _ _ _ _ _ _\
            /           /   /              /                             /
           // JAMstack     // Separation of Concerns (decoupled GUI logic from data logic)
          // Flexible     // Connected via API.                       /
         // Scalable                    /                            /
        // Secure                      /                            /
       // Modular                     /
      // Framework, data, and platform agnostic
     // GUI & business logic       /
    // Decoupled and independent GUI allows templating across applications
   // Semantic HTML and native web components for dynamic data hooks
  // Leverages native CSS passive reactiveness
 // Smaller codebase


```
