//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "DummySolver.h"
#import "Board.h"
#import "Solution.h"


@implementation DummySolver {

}
- (instancetype)initWithBoard:(Board *)board {
    self = [super init];
    if (self) {
        _board = board;
    }

    return self;
}

+ (instancetype)solverWithBoard:(Board *)board {
    return [[self alloc] initWithBoard:board];
}

- (Solution *)solve {
    return [Solution new];
}


@end