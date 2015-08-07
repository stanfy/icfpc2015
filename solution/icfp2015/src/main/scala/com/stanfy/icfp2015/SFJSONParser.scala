package com.stanfy.icfp2015

import org.json4s._
import org.json4s.native.JsonMethods._

/**
 * Created by hdf on 07.08.15.
 */

object SFJSONParser {
  def parseJSON(input:String):JValue = {
    val json = parse(input)
    return json
  }
}
