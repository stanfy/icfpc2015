//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface CommandLineTask : NSObject

@property(nonatomic, strong) NSString *filePath;
@property(nonatomic, strong) NSArray *powerWords;
@property(nonatomic, assign) double limit;
@property(nonatomic, assign) double maxMemoryUsage;

- (instancetype)initWithFilePath:(NSString *)filePath powerWords:(NSArray *)powerWords limit:(double)limit maxMemoryUsage:(double)maxMemoryUsage;
+ (instancetype)taskWithFilePath:(NSString *)filePath powerWords:(NSArray *)powerWords limit:(double)limit maxMemoryUsage:(double)maxMemoryUsage;

@end