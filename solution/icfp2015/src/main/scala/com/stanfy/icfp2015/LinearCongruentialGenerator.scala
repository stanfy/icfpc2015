package com.stanfy.icfp2015

/**
 * Created by ptaykalo on 8/7/15.

 */
object LinearCongruentialGenerator {
  def msRandom(rseed: Int): Iterator[Int] = new Iterator[Int] {
    var seed = rseed

    override def hasNext: Boolean = true

    override def next(): Int = {
      val nextSeed = seed >> 16
      seed = (seed * 1103515245 + 12345) & Int.MaxValue
      nextSeed
    }
  }

  def toString(it: Iterator[Int], n: Int = 20) = it take n mkString ", "

  def main(args: Array[String]) {
    println("-- seed 17 --")
    println("MS : " + toString(msRandom(17)))
  }

}


