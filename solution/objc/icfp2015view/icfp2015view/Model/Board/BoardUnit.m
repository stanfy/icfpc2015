//
// Created by Anastasi Voitova on 07.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "BoardUnit.h"
#import "BoardCell.h"


@interface BoardUnit ()
@property (nonatomic, readwrite) BoardCell * pivot;
@property (nonatomic, readwrite) NSArray * members;
@end


@implementation BoardUnit {

}

+ (instancetype)createFromDictionary:(NSDictionary *)dictionary {
    BoardUnit * unit = [BoardUnit new];
    unit.pivot = dictionary[@"pivot"];

    NSMutableArray * members = [NSMutableArray new];
    for (NSDictionary * dict in dictionary[@"members"]) {
        [members addObject:[BoardCell createFromDictionary:dict]];
    }
    unit.members = members;

    return unit;
}


- (NSString *)description {
    NSMutableString * description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"self.pivot=%@", self.pivot];
    [description appendFormat:@", self.members=%@", self.members];
    [description appendString:@">"];
    return description;
}


@end