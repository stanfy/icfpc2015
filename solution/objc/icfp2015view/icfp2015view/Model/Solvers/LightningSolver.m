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
            return @"SE SE SE SE SE SE SE SE E SE SE SE SE SE SE SE SE E SE SE SE SE SE SE SW SE SE SE SW SW SE SE CC CC CC CC SE SE SW SE SE SW SW SW SW SE SW SE SE SE SE SW SW SW SW CC SW SE SW SE SW SE SW SW SW SW SW SW SW SW SW W SE SE CC CC CC CC SW SW SW SW SW SW SW SW CC SE SE SW SE SW SW SE SE SE SE SE SE SW SE SE SW SW CC SE SE SW CC SE SE SW SW SW SW SW SW SW CC SE SE SE SE SE SE SE CC CC SW SW CC CC SE SE SW SW SE SE E E E SW SW SW SW SW SW SW SW SE SE SE";
        }
    }

    if (intBoard == 1) {
        if (intSeed == 0) {
            return @"SE SE SE SW SW SW SW SE SE SE E SE SE SE SW SW SW SW SW SE SE W E E E E SE SE SE SE SE SE SE SW SW SW W W SE SE SE SE SE SE SE SW SW SE W SE SE SE E E E E SE SE SE SE SW SW SW E E E E E E SE SE SE SE SE SE SE SW SW SW W SW W W W W SW SW SW SW SW SE SE SE SW W W SW SW W W W W W SW SE SE SW SW SW SE SE E SE SE SE SE SE SW SE SE SE SE E E E E SE SE SE E E E E SE SE SW SW SE SE SW E E E E E E SE SE SE SE SW SW SE SW SW SW E SW SW SE SE SE E SE SE SE SE SE E SE SE SE SE SE SE SE SW SE SW E SE SE SE SE SE SE SW SW SW SE W SE SE SE SE W SW SW SW SW SW SW SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW W W W SE SE SE SW SW SW SW SW SW SW W W SE SE SE SW SW SW SW SW SW SW E E E SE SE SE SW SW SW SW SW SW SW E E SE SE SE SW SW SW SW SW SW SW W SW SW SW W W W SW SW SW SW SW SE SE SW SW SW SW SW SW W W W SW SW SW SW SW SE SE E SW SW SW W W W SW SW SW SW SW SE SW W SE";
        }
    }
    
    if (intBoard == 10) {
        if (intSeed == 0) {
            return @"C  SW  W  W  W  SW  SE  SW  C  E  E  E  E  SE  SE  SE  SE  C  SE  SE  CC  SE  SW  SE  E  E  SE  C  C  SW  W  SW  SW  SE  C  SW  W  W  W  SE  SE  SE  C  W  W  SE  SW  SW  SE  C  SW  W  SE  SE  E  C  SE  SE  SE  SE  E  C  SE  W  SE  SE  SE  SW  C  SE  SE  SE  SE  SE  C  E  E  SE  SE  SE  SE  C  E  SE  SE  SW  SE  E  E  E  C  SE  E  E  E  E  C  SE  SE  SE  SE  C  C  SW  SW  SW  SW  C  C  E  E  SW  SW  SW  W  W  C  C  E  E  SW  SW  SW  SW  C  C  E  E  E  E  SW  SW  SW  W  W  E  E  E  C  C  E  SW  SW  SW  SW  C  SE  SE  SE  C  E  E  E  E  SE  SE  SE  E  E  E  C  C  E  E  E  SW  SW  SW  C  C  SE  SW  SW  C  W  SW  SE  SE  SE  SW  SW  C  W  C  SE  SE  SE  SE  C  C  SW  E  CC  SE  SE  SE  SE  SE  SE  W  W  W  W  SE  SE  SE  SE  SE  SE  W  W  E  E  C  E  E  SE  SW  SE  SE  E  C  E  C  SW  SW  SW  W  W  W  C  SW  CC  E  E  E  E  SE  SE  SE  W  SE  W  W  W  W  SE  SE  SE  SE  W  SE  W  W  E  E  C  E  E  SE  SE  SE  E  C  E  SE  SE  SE  E  E  E  C  E  SW  SW  E  C  SE  SE  C  C  SW  SW  SW  SW  W  W  W  W  C  SE  SE  SE  C  C  SW  SW  SW  C  C  SW  SW  SW  SW  SW  SW  SW  SE  SE  E  E  SE  SE  SE  SW  SE  SE  SE  SE  E  C  SE  W  W  W  C  SW  SW  SE  SE  SE  SW  SW  SW  SW  SW  W  W  SE  SW  SW  SW  SE  SW  W  E  SE  SE  SE  SE  SW  SW  SW  SW  SE  E  E  E  C  E  SE  SE  SE  SW  SE  SW  SE  SE  SE  C  E  E  E  SE  SE  SE  SE  C  SW  SE  SE  SE  C  W  W  SE  SE  SE  SE  C  C  SW  SW  SW  SW  W  W  W  SE  SW  SE  SW  SW  SW  SW  W  W  W  C  SE  SE  SE  SE  C  C  SE  SW  SW  SW  C  C  SW  SW  SW  C  C  W  SW  SW  C  E  E  E  SE  SE  SE  SE  SE  SW  SE  SE  SW  SW  SW  C  E  E  SE  SE  SW  SW  C  C  C  E  E  E  E  SE  SW  SW  SW  SW  SW  SW  SW  SW  SW  SE  SW  SE  SE  SE  SE  SE  E  C  SE  E  E  E  C  SE  SE  SE  SE  C  E  E  E  E  SE  SW  SE  SE  C  SE  E  SE  SE  SE  SW  SW  SE  SW  SE  SW  SE  SW  W  SW  SE  SW  SW  SW  SW  SW  SW  SW  SW  W  SW  SW  SW  SW  SW  SW  SW  SE  SW  SW  C  SE  SE  SW  SW  SE  SE  C  E  E  SW  SE  SE  SE  E  E  C  E  SE  SE  C  C  SW  SW  SW  SW  C  C  SE  SW  SW  SW  C  C  SE  SE  SW  SW  C  E  C  E  SE  SW  SW  SW  W  C  SE  SE  SE  SE  C  SE  E  SE  SE  SE  E  C  E  E  SE  SE  SE  SE  C  SW  SE  SE  SE  C  SE  SE  SE  E  C  SE  SE  SE  SE  C  E  E  E  SE  SE  SE  SE  C  E  E  SW  SE  SE  SE  C  E  E  E  SE  SE  SE  SE  SW  SW  SW  SW  SW  SW  SW  SW  SW  SW  SW  SW  W  W  SW  SW  SW  SW  SW  SW  SW  SE  SE  SW  SW  SW  W  SW  SW  SW  SW  C  SE  SE  E  SE  SE  E  C  E  E  SE  SE  SE  SE  C  C  SW  SW  SW  SW  C  C  SE  SW  C  SE  SE  SE  SW  SW  SW  SW  SW  SW  SE  SW  SW  C  SW  SE  SE  SE  E  C  SE  SE  SE  SE  C  E  E  E  SE  SE  SE";
        }
    }

    if (intBoard ==  13) {
        if (intSeed == 0) {
            return @"SE SE SE SE E E SE SE SE SW SE SW SE SW SE SW SE SW SE SW SE SE SW SE SW SW SW SE SW SE SW SE SW SE SW SE SW SW SW SW SW SW SW SW SW SW SE SW SE SW SE SW SE SW SE SW SE SW SW SW SE SE E E E E SW E SW E SW E SW SW SW SW E SW E SW E SW SW SW";
        }
    }

    if (intBoard == 15) {
        if (intSeed == 0) {
            return @"SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SW SE SW SE SE SE SE SE SE SE SW SE SW SW SE SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SE SE SE SW SE SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE W SW SE SW SE W W W W SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SE SE SE SE SW SW SW SW SW SW W W SE SW SE SW SE SW SE SE SW SW SW SW SW W W W SE SW SE SW SE SW SE SW SE SW SE SW SE SW SW SW SW SW SW SW SW SW SW SW SE SW E SW SW SE SE SE SW SW SW SE SW SE SW SE SW SW SW SW SE SE SE SE SE SE SW SE SW SE W W SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW W W SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE E SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SW SE SE SW SE W";
        }
        if (intSeed ==  1) {
            return @"SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SE SW SE SW SW SW SW SE W SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SE SW SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SE SW SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SE SW SW SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SE SW SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SW SE SW SW SW SW SE SE SE E SE SE SE SE SE SE SE C SE E C SE SE SE SE SE SE SE SE W SE SE SE SE SE SE SE SE SE W SE SE SE W SE SE W SE SE W SE SE E E E E E SW SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SW SW SW SE SE SE SE SW SE SE SE SE SE SE SW SW SW SE SW SE SW SE SE SW SW SW SW SE SW SW SE SW SW SE SE E E E SE SW SW SW SW SW SE SE E SE SE SE SW SW E E E E SW SW SW SW E SW SW E SW SW SW SW SW W SW SW SW SW SW SW C SE SE SW SW SE SE SE SE SE SW SW SW SE SW SW SE SW SW SE SE SW SW SW SW SW SW SW SE SE SW SW SE SE SW SW SW SW C SW SW SW SW W SW SE C SW SW SW SW SE SW SW SW SW SW SW SW W SW SW SW SW SW SE SE SE SE E SE SE SE SE SE E SE SE SE SE SE SE SW SE SW SW SW SE SE SE E SE SE E E SE SW SW SE SE SE SE SE SE SE SE SW SW SE SE SE E E E E SW SW SW SW SW SE SE SE SW W SW SW SW SE SE SW SE C SW C SE SW SW SE SE SE E SE SE SE SW SW SE SE SE E E E SW SW SW SE SE SE SE SE SE";
        }
    }

    if (intBoard == 17) {
        if (intSeed == 0) {
            return @"SW SW SW SE SW SW SW SW SW SE SE SE SE E E SE SE SE SE SE SE SW SW SW SW SW SW W SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW W SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SW SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SW SE SE SE SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SW SW SW SW SW SW SE SW SE SW SW SW SE SE SE SE SW SW SW SW SW SE SW SW SE SW SW SW SE SW SW SW SE SW SW SW SE SW SW SW SE SW SE SE SW SE SW SW SW SW SW SE SE SW SW SW SE SW SW SW SW SE SW SW SW W SW SE SE SE SW SW SW SW SW SW SW SW SW SE SW SW SE SW SW SE SW SE SE SW SW SW SE SW SW SW SW SE SE SE SW SW SW SW SW SW SW SE SE SW SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SW SW SE SW SW SW SE SE SW SW SE SW SW SW SE SE SE SE SW SE SE SE SE SW SW SW SE SW SE SE SE SW SE SE SE SE SW SW SE SW SE SW SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SW SE SW SE SE SE SE E SE SE SE E SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SW SW W W SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE E SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE E SE SE SE SE SE SE SE SW SE SE SE E SE E SE SE SE SE SE SE SE SE SW SE SW SE SE E SE SE SE SE SE SE SE SE SE SW SE SE SE SE E SE SE SW SE SE SE SE SE E SE SE SE SE SE SW SE SE SE SE SE SE E SE SE SE SW SE SE SE SE SE SE E SE SE SW SE SE E SE SE SE SE SE SW SW SW SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SW SE SE SE SW SW SW SE SE SE SE SE SE SW SE SE SE SW SW SE SE SE SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SE SW SW SW SW SW SE SE SE SW SE SE SE SE SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE E SE SE SE SE SE SE SE SE SE SE SW SW SE SE SW SW SW SW SE SE SE SW SW SW W SW SW SW SE SW";
        }
    }

    if (intBoard == 19) {
        if (intSeed == 0) {
            return @"SW SE SW SE SW SW SW SW SE SE SE SW SW W W SW SW SW SW SW SW SW SE SW SE SE SE SE SW SW W W SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SE SW SW SW SW SW SE SW SW SE SW SW SE SE SE SW SW SW W W SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SW SE SE SE SE SE SE SE SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SE SE SE E E SE SW W W W W SW SW SW SW SW SW SE SE SE SE SE SE SE SW W W SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE E E E SW SW SW SW SW SW SW SW SE SE SE SE SE SE E E SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SE SW SE SW SE SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SE SE SE SW SE SW SW SE SE SW SW SW SW SW SW SW SW SW SE SW SE SW SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SE SE SE SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SE SW SE SW SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SE E SE SE SE SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SW SE SW SE SE SE SE SE SE SE SE SE SW SW SE SE SE SW SW SW SE SE SE SE SE SE SE SW SE SE SE SE SE SW SW SW SW SW SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SE SE SE SE E SE SE SE SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SW SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW W SW SW SW W W W SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SW SW SW SW SW W W SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SE SE SE SW SW SW SW SW SW SW SW SW SW SW SW SW SE SW SW SW SW SW SE SE SW SE SE SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SE SW SW SW SW SW SW SW SW SE SE SE SE SE SE SW SW SW SW SW SW SW SE SE SE SE SE SE SE SE SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW SW SE SE SE SE SE SE SE SE SW SE SW SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SW SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW W W SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SW SW SW SW SW SW SE SE SE SE SE SE SE SE SE SE";
        }
        if (intSeed == 1) {
            return @"SE SE E SE SE E SE SE E SE SE SE SE E SE SE E SE SE E SW SW SW SW W SW SW W SW SW W SW SW W SW SW W SW SW W SW SW W SW SW SW W SW SW W SW SW W SW W SW SW W SW SW W SW W SW SW SW W SW SW W SW";
        }
    }

    if (intBoard == 20) {
        if (intSeed == 0) {
            return @"SW SW SW SW SW SW SE SW SW SW SW SW SE SW W SW SE SE SW SW SW SW W SW SW SW SW SW SW SW SE SE SE SE SW SW SW SE SE SE SW SW SW SW SW SW SW SE SE SW SW SW SW SW SW SE SW SE SW SW SE SE SW SW SW SW SW SW SE SW SW SW SE SE SE SE SE SW SE SW SW SE SW SW SW SE SE SE SE SE SE W SW SW SE SW SW SE SE SE SE SE SE SE SE SE SE SE SW SW W SW SW SE SE SE SE SE SW W W SW SW SW SW SE SE SE SE SE SE SE SE SE SE SW SW SW SW SE SE SE SE SE SE SW SE SE SW SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SE SE E E SE SE SE SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SW SE SE SE SW SW SW SW SW SW SW SW SW SW SE SE SE SW SW SW SE SW SW SW SW SE SW SW SW SW SW SW SW SW SW SW SE SW SW SE SE SE SW SW SW W W W W SW SW SW SW SE SW SE SE SE SE SW SW SW SE SE SW SE SW SW SE SE SE SE SE SE SW SW SW SE SW SW SW SE SE SE SE SE SE SW SW SE SW SW SW SE SE SE SE SW SE SE SE SW SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE SE E SE SE SE SE SE E E E SE SE C SW SW CC SE E E E E E E E E SE SE SE SW SW SW SW SE SE SW SE SE SE SE SW SW SW SW SW SW SW SE SW SE SW SW SW SW SW SE SE SW SW SE SW SW W W W SW SW SW SW SW SE SE SW SW SW SW W W W SW SW SW SE SE SW SW SW SW SW SW SE SE SE SW SW SW W W SW SE SE SE SW SW SW SE SW SW SW SE SE SE SW SW SE SE SE SE SE SW SW SW SE SE SE SE SE SE SE SE SE SE SE SE SW SW SW";
        }
    }

    if (intBoard == 22) {
        if (intSeed == 0) {
            return @"E E E C E SE SE C C W W W SW SW SW W W C C SW SW SW SW W SW SW SW SW W SW SW SW SE SW SW SW SE SE SE SE SE C E E E E E E C E E SE SW SE C E E E SE SE SE SE SE SW SW SW W W SW SW SW C C W W W SW SW C SE E C C SE SE E E E C SE C E E E E E E E";
        }
    }

    return nil;
}


+ (NSString * )lettersForBoardID:(NSNumber * )boardId seed:(NSNumber * )seed {
    NSString * command = [[self class] commandsForBoardID:boardId seed:seed];

    return [CommandToLettersConvertor generateLettersFrom:command];
}

@end