//
// Created by Paul Taykalo on 8/7/15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "DummySolver.h"
#import "Board.h"
#import "Solution.h"


@implementation DummySolver {

}
- (instancetype)initWithBoard:(Board *)board {
    self = [super init];
    if (self) {
        _board = board;
    }

    return self;
}

+ (instancetype)solverWithBoard:(Board *)board {
    return [[self alloc] initWithBoard:board];
}

- (NSString * )tagForBoardID:(NSNumber * )boardID seed:(NSNumber * )seed {
    return [NSString stringWithFormat:@"%@-%@-%f", boardID, seed, [NSDate timeIntervalSinceReferenceDate]];
}


#pragma mark - result

- (NSArray *)solve {

    NSNumber * boardID = self.board.ID;
    NSMutableArray * array = [NSMutableArray array];

    for (NSNumber * seed in self.board.sourceSeeds) {

        Solution * s = [Solution solutionWithProblemId:boardID
                                                  seed:seed
                                                   tag:[self tagForBoardID:boardID seed:seed]
                                              commands:@"123"];
        [array addObject:s];
    }

    return array;
}


- (NSString * )jsonFromSolutions:(NSArray * )solutions {
    NSMutableArray * array = [NSMutableArray new];
    for (Solution * solution in solutions) {
        [array addObject:[solution jsonDictionary]];
    }

    if ([NSJSONSerialization isValidJSONObject:array]) {

        NSError * error;
        NSData * data = [NSJSONSerialization dataWithJSONObject:array options:NSJSONWritingPrettyPrinted error:&error];

        if (data && !error) {
            NSString * jsonString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
            return jsonString;
        }
    }
    return nil;
}


@end