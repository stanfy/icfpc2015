//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface LinearCongruentGenerator : NSObject

@property(nonatomic, assign) SInt32 seed;

- (instancetype)initWithSeed:(SInt32)seed;
+ (instancetype)generatorWithSeed:(SInt32)seed;
+ (instancetype)defaultGenerator;

- (SInt32)nextValue;

@end