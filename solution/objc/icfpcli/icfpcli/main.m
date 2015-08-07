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

        NSLog(@"task = %@", task);

        // board
        NSString * problemPath = [[NSBundle mainBundle] pathForResource:@"problem_0" ofType:@"json"];
        NSString * problemJson = [[NSString alloc] initWithData:[[NSData alloc] initWithContentsOfFile:problemPath]
                                                       encoding:NSUTF8StringEncoding];
        
        Board * board = [BoardCreator createBoardFromJson:problemJson];
        NSLog(@"board %@", board);
    }
    return 0;
}
