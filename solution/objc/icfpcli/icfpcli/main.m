//
//  main.m
//  icfpcli
//
//  Created by Paul Taykalo on 8/1/15.
//  Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LinearCongruentGenerator.h"

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // insert code here...

        LinearCongruentGenerator * gen = [LinearCongruentGenerator generatorWithSeed:17];
        for (int i = 0; i < 20; ++i) {
            NSLog(@" %d",[gen nextValue]);
        }
        NSLog(@"Hello, World!");
    }
    return 0;
}
