//
// Created by Anastasi Voitova on 07.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "BoardCell.h"


@interface BoardCell ()
@property (nonatomic, readwrite) NSNumber * x;
@property (nonatomic, readwrite) NSNumber * y;
@end


@implementation BoardCell {

}


+ (instancetype)createFromDictionary:(NSDictionary *)dictionary {
    BoardCell * cell = [BoardCell new];
    cell.x = (NSNumber * )dictionary[@"x"];
    cell.y = (NSNumber * )dictionary[@"y"];
    return cell;
}


- (NSString *)description {
    NSMutableString * description = [NSMutableString stringWithFormat:@"<%@: ", NSStringFromClass([self class])];
    [description appendFormat:@"self.x=%@", self.x];
    [description appendFormat:@", self.y=%@", self.y];
    [description appendString:@">"];
    return description;
}


@end