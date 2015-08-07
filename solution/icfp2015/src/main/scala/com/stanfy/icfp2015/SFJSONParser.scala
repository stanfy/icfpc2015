package com.stanfy.icfp2015

import org.json4s._
import org.json4s.native.JsonMethods._

/**
 * Created by hdf on 07.08.15.
 */
object SFJSONParser {
  def main(args: Array[String]): Unit = {

    val json = parse( """
     { "name": "joe",
       "children": [
         {
           "name": "Mary",
           "age": 5
         },
         {
           "name": "Mazy",
           "age": 3
         }
       ]
     }
                      """)
    print((json \ "children")(0))
  }
}
