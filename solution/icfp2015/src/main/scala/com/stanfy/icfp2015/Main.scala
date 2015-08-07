package com.stanfy.icfp2015


/**
 * Created by hdf on 07.08.15.
 */

object Main {
  def main(args: Array[String]): Unit = {

    val testData = TestData
    val parsedJson = SFJSONParser.parseJSON(testData.testJson)

    println(parsedJson)
  }
}