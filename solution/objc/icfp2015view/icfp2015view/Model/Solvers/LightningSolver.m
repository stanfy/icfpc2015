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

    if (intBoard == 1) {
        if (intSeed == 0) {
            return @"SE SE SE SW SW SW SW SE SE SE E SE SE SE SW SW SW SW SW SE SE W E E E E SE SE SE SE SE SE SE SW SW SW W W SE SE SE SE SE SE SE SW SW SE W SE SE SE E E E E SE SE SE SE SW SW SW E E E E E E SE SE SE SE SE SE SE SW SW SW W SW W W W W SW SW SW SW SW SE SE SE SW W W SW SW W W W W W SW SE SE SW SW SW SE SE E SE SE SE SE SE SW SE SE SE SE E E E E SE SE SE E E E E SE SE SW SW SE SE SW E E E E E E SE SE SE SE SW SW SE SW SW SW E SW SW SE SE SE E SE SE SE SE SE E SE SE SE SE SE SE SE SW SE SW E SE SE SE SE SE SE SW SW SW SE W SE SE SE SE W SW SW SW SW SW SW SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW W W W SE SE SE SW SW SW SW SW SW SW W W SE SE SE SW SW SW SW SW SW SW E E E SE SE SE SW SW SW SW SW SW SW E E SE SE SE SW SW SW SW SW SW SW W SW SW SW W W W SW SW SW SW SW SE SE SW SW SW SW SW SW W W W SW SW SW SW SW SE SE E SW SW SW W W W SW SW SW SW SW SE SW W SE";
        }
    }

    return nil;
}


+ (NSString * )lettersForBoardID:(NSNumber * )boardId seed:(NSNumber * )seed {
    NSString * command = [[self class] commandsForBoardID:boardId seed:seed];

    return [CommandToLettersConvertor generateLettersFrom:command];
}

@end