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
#import "BoardCreator.h"

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        // insert code here...

        NSArray *arguments = [[NSProcessInfo processInfo] arguments];

        CommandLineTask *task = [[[ArgumentsParser alloc] initWithArguments:arguments] taskFromArguments];

        // Board?
        //
        Board *board = [BoardCreator createBoardFromFile:task.filePath];
        DummySolver *solver = [DummySolver solverWithBoard:board];
        Solution *solution = [solver solve];

        NSLog(@"task = %@", task);
        NSLog(@"solution = %@", solution);
    }
    return 0;
}
