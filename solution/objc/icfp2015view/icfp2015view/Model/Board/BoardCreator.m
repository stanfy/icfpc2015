//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "BoardCreator.h"
#import "Board.h"


@implementation BoardCreator {

}
+ (Board *)createBoardFromJson:(NSString *)json {
    NSData *jsonData = [json dataUsingEncoding:NSUTF8StringEncoding];
    NSError *e;
    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&e];

    Board * board = [Board createFromDictionary:dict];

    return board;
}

@end