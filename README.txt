CS 412/512 HW6 - Texture Mapping (Enrique Mendoza)

Open index.html from a web server (GitHub Pages, or python3 -m http.server).

1. Texture mapping on 3 new primitives (all curved):
   - Sphere: soccer ball texture (textures/ball.png)
   - Cone: training cone texture (textures/cone.png)
   - Torus: LED ring video texture (textures/unm.webm)
   Texture coordinates use the simple mappings from the slides.
2. Animated texture: the torus uses a looping video, updated every frame
   with texImage2D(videoElement).
3. Bump and normal mapping (in addition to the template cube and cylinder):
   - Normal mapping: the soccer ball, with its own normal map
     (textures/ball_normal.png): n = (R, G, B) x 2 - 1, n' = TBN n.
   - Bump mapping: the training cone, height from the texture brightness.
4. Extra: soccer theme, the ball spins by itself, scrolling "GO UNM!" LED ring.
