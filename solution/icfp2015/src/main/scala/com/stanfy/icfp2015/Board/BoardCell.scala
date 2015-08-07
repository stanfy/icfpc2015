package com.stanfy.icfp2015.Board

/**
 * Created by hdf on 07.08.15.
 */

// x: column, y:row
class BoardCell(val x:Int, val y:Int) {

  override def toString(): String = "(" + x + ", " + y + ")"
}
