package com.stanfy.icfp2015.Board

import org.json4s._
import org.json4s.native.JsonMethods._
import org.json4s.jackson.Serialization
import org.json4s.Formats

/**
 * Created by hdf on 07.08.15.
 */

class Board(val input:String) {

  implicit val formats = {
    Serialization.formats(ShortTypeHints(List(classOf[BoardCell], classOf[BoardUnit])))
  }

  val parsedJson = parse(input)

  val id = parsedJson \ "id"

  val width = parsedJson \ "width"
  val height = parsedJson \ "height"

  val sourceLength = parsedJson \ "sourceLength"
  val sourceSeeds = (parsedJson \ "sourceSeeds") //.extract[List[JInt]]

  val filledCells = (parsedJson \ "filled").extract[List[BoardCell]]

  val units = (parsedJson \ "units").extract[List[BoardUnit]]
}
