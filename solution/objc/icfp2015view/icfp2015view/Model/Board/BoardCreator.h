//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@class Board;


@interface BoardCreator : NSObject

+ (Board *)createBoardFromJson:(NSString *)json;
+ (Board *)createBoardFromFile:(NSString *)filePath;

@end