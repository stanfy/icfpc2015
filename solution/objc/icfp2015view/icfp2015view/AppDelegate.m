//
//  AppDelegate.m
//  icfp2015view
//
//  Created by Paul Taykalo on 8/1/15.
//  Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import "AppDelegate.h"
#import "Board.h"
#import "BoardCreator.h"
#import "BoardsConfigCollection.h"


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    NSString * problemPath = [[NSBundle mainBundle] pathForResource:@"problem_0" ofType:@"json"];
    NSString * problemJson = [[NSString alloc] initWithData:[[NSData alloc] initWithContentsOfFile:problemPath]
                                                   encoding:NSUTF8StringEncoding];

    Board * board = [BoardCreator createBoardFromJson:problemJson];

    NSLog(@"board %@", board);
    return YES;
}

@end
