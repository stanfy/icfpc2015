We will post more details later... 


# Dependencies

Program needs node.js server. 

You can download it from
https://nodejs.org/

or we have added script inside Makefile that should download it automatically.

play_icfp2015 is command line js file, that post result to console.



# Output

Program writes debug into to std:err and result to std:out.
https://twitter.com/ICFPContest2015/status/630667692370886656



# Solving problems
1. Program makes simple loop among all seeds. For each seed algo is the same.
2. "Brain" is our engine. It controlls all steps and decides what to do (play hex-tris or post cats to twitter :))
2. Everything starts when new unit appears. "Estimator" finds top 10 best positions for it to move next. Estimator uses bunch of coefficients to select positions. It tries to "fill holes" and to create full-lines. 
2. Then A* algo finds way to best positions.
3. Unit moves to position that is reachable. 
4. It continues until no reachable positions found for last unit.
5. Command interpretator transforms commands into letters, trying to use power phrases.
6. And output json is generated :)


# Code base

If you're interested, you can find sources in such languages:

- obj-c (command line tool and iPhone app). Used to post results on lightning round
- scala. We started from scala, but then moved to obj-c :)
- python. First visualizator was written on python
- node.js/javascript. Last tool and we used most. Visualizer, brain, estimator, a*, cli - everything is written on javascript. To play with visualizer, please, start "npm start" and open "localhost:3000" in browser.

![pic](solution/visualizer/viz.png?raw=true)


# Power phrases

Our solutions don't use many of them, but this is our suggestion list:

    "ei!",
    "cthulhu",
    "as2h2",
    "galois",
    "aleister",
    "davar",
    "pentagram",
    "lambda",
    "ia! ia!",
    "turing",
    "r'lyeh!",
    "yuggot",
    ".....",
    "ph'nglui mglw'nafh cthulhu r'lyeh wgah'nagl fhtagn!",
    "conway",
    "hopcroft",
    "backus",
    "bigboote",
    "big-booty",
    "bigboo-tay",
    "pluto",
    "monkeyboy",
    "ether",
    "icfp2015"


# It was awesome and fun

Stanfy+ team <3 you and we're waiting for next year. Hope to perform better that this time.
