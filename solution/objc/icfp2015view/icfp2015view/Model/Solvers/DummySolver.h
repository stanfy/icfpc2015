//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "SolverProtocol.h"

@class Board;


@interface DummySolver : NSObject <SolverProtocol>

@property(nonatomic, strong) Board *board;

- (instancetype)initWithBoard:(Board *)board;

- (NSString *)jsonFromSolutions:(NSArray *)solutions;

+ (instancetype)solverWithBoard:(Board *)board;


@end