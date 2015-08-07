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
    NSLog(@"===================");
    NSLog(@"Seed is %u", (int) _seed);

    SInt32 value = _seed >> 16;
    NSLog(@"Next value is %u", (int) value);

    SInt32 mul = _seed * 1103515245;
    NSLog(@"After mul is %u", (int) mul);

    SInt32 afterAdd = mul + 12345;
    NSLog(@"After add is %u", (int) afterAdd);

    _seed = afterAdd & INT32_MAX;
    NSLog(@"Next seed is %u", (int) _seed);

    return value;
}


@end