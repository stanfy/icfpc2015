//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>

@class Solution;

@protocol SolverProtocol <NSObject>
/*
Generates array of solutions
 */
- (NSArray *)solve;

@end