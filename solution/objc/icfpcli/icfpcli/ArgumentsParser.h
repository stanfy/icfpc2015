//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

@class CommandLineTask;


@interface ArgumentsParser : NSObject

@property(nonatomic, strong) NSArray *arguments;

- (instancetype)initWithArguments:(NSArray *)arguments;
+ (instancetype)parserWithArguments:(NSArray *)arguments;

- (CommandLineTask *)taskFromArguments;


@end