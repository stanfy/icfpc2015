//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface Solution : NSObject

@property (nonatomic, readonly) NSNumber * problemId;
@property (nonatomic, readonly) NSNumber * seed;
@property (nonatomic, readonly) NSString * tag;
@property (nonatomic, readonly) NSString * commands;

- (instancetype)initWithProblemId:(NSNumber *)problemId seed:(NSNumber *)seed tag:(NSString *)tag commands:(NSString *)commands;

+ (instancetype)solutionWithProblemId:(NSNumber *)problemId seed:(NSNumber *)seed tag:(NSString *)tag letters:(NSString *)commands;

- (NSString *)jsonString;

- (NSDictionary *)jsonDictionary;


@end