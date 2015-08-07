//
//  main.m
//  icfpcli
//
//  Created by Paul Taykalo on 8/1/15.
//  Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "LinearCongruentGenerator.h"
#import "CommandLineTask.h"
#import "ArgumentsParser.h"
#import "DummySolver.h"
#import "Board.h"
#import "BoardCreator.h"

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        // insert code here...

        NSArray *arguments = [[NSProcessInfo processInfo] arguments];

        CommandLineTask *task = [[[ArgumentsParser alloc] initWithArguments:arguments] taskFromArguments];

        LinearCongruentGenerator *gen = [LinearCongruentGenerator generatorWithSeed:17];
        for (int i = 0; i < 20; ++i) {
            NSLog(@" %d", [gen nextValue]);
        }
        NSLog(@"Hello, World!");

        // Board?
        //
        Board *board = [BoardCreator createBoardFromFile:task.filePath];
        DummySolver *solver = [DummySolver solverWithBoard:board];
        Solution *solution = [solver solve];
        
        NSLog(@"board = %@", board);
        NSLog(@"task = %@", task);
        NSLog(@"solution = %@", solution);
    }
    return 0;
}
