//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface Board : NSObject

@property (nonatomic, readonly) NSNumber * ID;
@property (nonatomic, readonly) NSNumber * width;
@property (nonatomic, readonly) NSNumber * height;
@property (nonatomic, readonly) NSNumber * sourceLength;

@property (nonatomic, readonly) NSArray * units;
@property (nonatomic, readonly) NSArray * filledCells;
@property (nonatomic, strong) NSArray * sourceSeeds;


+ (Board *)createFromDictionary:(NSDictionary *)dictionary;

@end