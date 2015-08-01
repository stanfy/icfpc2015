//
//  icfp2015viewTests.m
//  icfp2015viewTests
//
//  Created by Paul Taykalo on 8/1/15.
//  Copyright (c) 2015 Stanfy LLC. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

@interface icfp2015viewTests : XCTestCase

@end

@implementation icfp2015viewTests

- (void)setUp {
    [super setUp];
}

- (void)tearDown {
    [super tearDown];
}

- (void)testExample {
    NSString *string = [NSString stringWithFormat:@"ICFP Contest %@", @([[NSCalendar currentCalendar] components:NSCalendarUnitYear fromDate:[NSDate date]].year)];
    XCTAssertEqualObjects(@"ICFP Contest 2015", string);
}

- (void)testPerformanceExample {
    [self measureBlock:^{
        // Put the code you want to measure the time of here.
    }];
}

@end
