//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "LinearCongruentGenerator.h"


@implementation LinearCongruentGenerator

- (instancetype)initWithSeed:(SInt32)seed {
    self = [super init];
    if (self) {
        _seed = seed;
    }

    return self;
}

+ (instancetype)generatorWithSeed:(SInt32)seed {
    return [[self alloc] initWithSeed:seed];
}

+ (instancetype)defaultGenerator {
    return [LinearCongruentGenerator generatorWithSeed:17];
}

- (SInt32)nextValue {
    SInt32 nextSeed = _seed >> 16;
    _seed = (_seed * 1103515245 + 12345) & INT32_MAX;
    return nextSeed;
}


@end