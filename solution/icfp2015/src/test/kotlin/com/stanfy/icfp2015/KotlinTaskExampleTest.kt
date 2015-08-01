package com.stanfy.icfp2015

import org.junit.Test
import kotlin.test.assertEquals

/**
 * Created by ptaykalo on 8/1/15.
 */
class KotlinTaskExampleTest {
    @Test
    fun testSubstraction() {
        assertEquals(KotlinTaskExample().subsctract(20,30), -10);
    }

    @Test
    fun testMixin() {
        // Calculating
        // (a - b) + d * c

        val a: Int = 10
        val b: Int = 7
        val c: Int = 5
        val d: Int = 2

        val example: KotlinTaskExample = KotlinTaskExample()
        val subsctract = example.subsctract(a, b)
        val multiplication = ScalaTaskExample.multiply(c, d)
        val addition = TaskExample.add(subsctract, multiplication)

        assertEquals(addition, 13)
    }
}