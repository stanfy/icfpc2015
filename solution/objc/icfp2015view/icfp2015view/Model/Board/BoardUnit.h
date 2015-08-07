//
// Created by Anastasi Voitova on 07.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@class BoardCell;


@interface BoardUnit : NSObject

@property (nonatomic, readonly) BoardCell * pivot;
@property (nonatomic, readonly) NSArray * members;

+ (instancetype)createFromDictionary:(NSDictionary *)dictionary;
@end