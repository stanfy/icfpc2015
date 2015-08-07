package com.stanfy.icfp2015.Board

import org.json4s._
import org.json4s.jackson.JsonMethods._

/**
 * Created by hdf on 07.08.15.
 */
class JsonParser(val json:String) {

  val parsed = parse(json)
}
