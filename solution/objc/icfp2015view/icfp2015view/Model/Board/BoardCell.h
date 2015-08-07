//
// Created by Anastasi Voitova on 07.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>


@interface BoardCell : NSObject

@property (nonatomic, readonly) NSNumber * x;
@property (nonatomic, readonly) NSNumber * y;

+ (instancetype)createFromDictionary:(NSDictionary * )dictionary;

@end