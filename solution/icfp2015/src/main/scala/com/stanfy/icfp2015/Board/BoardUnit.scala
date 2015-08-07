package com.stanfy.icfp2015.Board


import org.json4s.FullTypeHints
import org.json4s.JsonAST.JObject
import org.json4s.jackson.Serialization
import org.json4s.native.JsonMethods._
import com.stanfy.icfp2015.Board.Cell
/**
 * Created by hdf on 07.08.15.
 */
class BoardUnit (val a:JObject) {

  println("allsldklsd "+ a)

  implicit val formats = {
    Serialization.formats(FullTypeHints(List(classOf[Cell])))
  }
//
//  val members = (parsedJson \ "members").extract[List[Cell]]

  val pivot = (a \ "pivot").extractOpt[Cell]
}
