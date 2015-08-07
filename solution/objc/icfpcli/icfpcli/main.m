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
#import "Solution.h"


int main(int argc, const char *argv[]) {
    @autoreleasepool {
        // insert code here...

        NSArray *arguments = [[NSProcessInfo processInfo] arguments];

        CommandLineTask *task = [[[ArgumentsParser alloc] initWithArguments:arguments] taskFromArguments];

        NSString * filePath = task.filePath;
        if (!filePath || ![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
            filePath = @"/Users/hdf/projects/icfp2015/problems/problem_6.json";
        }
        
        Board *board = [BoardCreator createBoardFromFile:filePath];
        DummySolver *solver = [DummySolver solverWithBoard:board];

        NSArray * solutions = [solver solve];
        NSString * json = [solver jsonFromSolutions:solutions];
        NSLog(@"%@", json);
    }
    return 0;
}
