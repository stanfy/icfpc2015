package com.stanfy.icfp2015.Board
/**
 * Created by hdf on 07.08.15.
 */
class BoardUnit (members: List[BoardCell], pivot: BoardCell) {

  override def toString(): String = "{pivot" + pivot + ", members " + members + "}"
}
