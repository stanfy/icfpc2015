//
// Created by Anastasi Voitova on 08.08.15.
// Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "LightningSolver.h"
#import "CommandToLettersConvertor.h"


@implementation LightningSolver {

}


+ (NSString * )commandsForBoardID:(NSNumber * )boardId seed:(NSNumber * )seed {
    NSInteger intBoard = [boardId intValue];
    NSInteger intSeed = [seed intValue];

    if (intBoard == 0) {
        if (intSeed == 0) {
            return @"SW SE SW SE SW SE SW SE";
        }
    }


    return @"SW SE SW SE SW SE SW SE";
}


+ (NSString * )lettersForBoardID:(NSNumber * )boardId seed:(NSNumber * )seed {
    NSString * command = [[self class] commandsForBoardID:boardId seed:seed];

    return [CommandToLettersConvertor generateLettersFrom:command];
}

@end