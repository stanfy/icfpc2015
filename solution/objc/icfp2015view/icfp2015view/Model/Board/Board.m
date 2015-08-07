//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "Board.h"
#import "BoardCell.h"
#import "BoardUnit.h"


@interface Board ()
@property (nonatomic, readwrite) NSNumber * ID;
@property (nonatomic, readwrite) NSNumber * width;
@property (nonatomic, readwrite) NSNumber * height;
@property (nonatomic, readwrite) NSNumber * sourceLength;
@property (nonatomic, readwrite) NSArray * units;
@property (nonatomic, readwrite) NSArray * filledCells;
@end


@implementation Board {

}
+ (Board *)createFromDictionary:(NSDictionary *)dictionary {

    Board * board = [Board new];
    board.ID = dictionary[@"id"];
    board.width = dictionary[@"width"];
    board.height = dictionary[@"height"];
    board.sourceLength = dictionary[@"sourceLength"];


    NSMutableArray * array = [NSMutableArray new];
    for (NSDictionary * dict in dictionary[@"units"]) {
        [array addObject:[BoardUnit createFromDictionary:dict]];
    }
    board.units = array;

    array = [NSMutableArray new];
    for (NSDictionary * dict in dictionary[@"filled"]) {
        [array addObject:[BoardCell createFromDictionary:dict]];
    }
    board.filledCells = array;

    array = [NSMutableArray new];
    for (NSNumber * seed in dictionary[@"sourceSeeds"]) {
        [array addObject:seed];
    }
    board.sourceSeeds = array;

    return board;
}


- (NSString *)description {
    NSMutableString * description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"self.ID=%@", self.ID];
    [description appendFormat:@", self.width=%@", self.width];
    [description appendFormat:@", self.height=%@", self.height];
    [description appendFormat:@", self.sourceLength=%@", self.sourceLength];
    [description appendFormat:@", self.units=%@", self.units];
    [description appendFormat:@", self.filledCells=%@", self.filledCells];
    [description appendFormat:@", self.sourceSeeds=%@", self.sourceSeeds];
    [description appendString:@">"];
    return description;
}

@end