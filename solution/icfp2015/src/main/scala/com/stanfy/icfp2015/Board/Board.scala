package com.stanfy.icfp2015.Board


/**
 * Created by hdf on 07.08.15.
 */

class Board(val id:Int, val units:List[BoardUnit], val width:Int, val height:Int,
            val filled:List[BoardCell],
            val sourceLength:Int, val sourceSeeds:List[Int]) {
}
