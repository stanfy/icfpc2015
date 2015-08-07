package com.stanfy.icfp2015

import com.stanfy.icfp2015.example.ScalaTaskExample
import org.junit._
import org.junit.Assert._

/**
 * Created by ptaykalo on 8/1/15.
 */
class ScalaTaskExampleTest {

  @Test
  def testMultiplication() {
    assertEquals(ScalaTaskExample.multiply(6, 8), 48)
  }

  @Test
  def testMixin() {
    // Calculating
    // (a - b) + d * c

    val a: Int = 10
    val b: Int = 7
    val c: Int = 5
    val d: Int = 2

    val example: KotlinTaskExample = new KotlinTaskExample()
    val subsctract = example.subsctract(a, b)
    val multiplication = ScalaTaskExample.multiply(c, d)
    val addition = TaskExample.add(subsctract, multiplication)

    assertEquals(addition, 13)
  }

}
