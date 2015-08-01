package com.stanfy.icfp2015;

import org.junit.Test;
import static org.junit.Assert.*;

/**
 * Created by ptaykalo on 8/1/15.
 */
public class TaskExampleTest  {

  @Test
  public void testAddition() throws Exception {
    assertEquals(TaskExample.add(2, 3), 5);
  }

  @Test
  public void testMixin() {
    // Calculating
    // (a - b) + d * c
    Integer a = 10;
    Integer b = 7;
    Integer c = 5;
    Integer d =2;

    KotlinTaskExample example = new KotlinTaskExample();
    int subsctract = example.subsctract(a, b);
    int multiplication = ScalaTaskExample.multiply(c, d);
    int addition = TaskExample.add(subsctract, multiplication);

    assertEquals(addition, 13);
  }
}
